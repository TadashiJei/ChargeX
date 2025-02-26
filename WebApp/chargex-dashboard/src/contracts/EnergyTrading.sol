// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title EnergyTrading
 * @dev Smart contract for peer-to-peer energy trading in the ChargeX ecosystem
 */
contract EnergyTrading {
    // Enum for order status
    enum OrderStatus { Open, Filled, Cancelled }
    
    // Enum for order type
    enum OrderType { Buy, Sell }
    
    // Struct for energy order
    struct EnergyOrder {
        uint256 orderId;
        address trader;
        OrderType orderType;
        uint256 energyAmount; // in Wh
        uint256 pricePerUnit; // in wei per Wh
        uint256 timestamp;
        OrderStatus status;
        address filledBy;
        uint256 filledTimestamp;
    }
    
    // Struct for trade
    struct Trade {
        uint256 tradeId;
        uint256 buyOrderId;
        uint256 sellOrderId;
        address buyer;
        address seller;
        uint256 energyAmount;
        uint256 totalPrice;
        uint256 timestamp;
    }
    
    // State variables
    EnergyOrder[] public orders;
    Trade[] public trades;
    
    // Mapping from user address to their orders
    mapping(address => uint256[]) private userOrders;
    
    // Mapping from user address to their trades
    mapping(address => uint256[]) private userTrades;
    
    // Events
    event OrderCreated(uint256 indexed orderId, address indexed trader, OrderType orderType, uint256 energyAmount, uint256 pricePerUnit);
    event OrderFilled(uint256 indexed orderId, address indexed filledBy);
    event OrderCancelled(uint256 indexed orderId);
    event TradeExecuted(uint256 indexed tradeId, uint256 buyOrderId, uint256 sellOrderId, address buyer, address seller, uint256 energyAmount, uint256 totalPrice);
    
    // Modifiers
    modifier onlyOrderOwner(uint256 _orderId) {
        require(
            orders[_orderId].trader == msg.sender,
            "Only the order owner can perform this action"
        );
        _;
    }
    
    /**
     * @dev Create a new buy order
     * @param _energyAmount Amount of energy to buy in Wh
     * @param _pricePerUnit Maximum price willing to pay per Wh
     */
    function createBuyOrder(
        uint256 _energyAmount,
        uint256 _pricePerUnit
    ) external payable returns (uint256) {
        require(_energyAmount > 0, "Energy amount must be greater than 0");
        require(_pricePerUnit > 0, "Price per unit must be greater than 0");
        
        uint256 totalCost = _energyAmount * _pricePerUnit;
        require(msg.value >= totalCost, "Insufficient funds for buy order");
        
        uint256 orderId = orders.length;
        
        EnergyOrder memory newOrder = EnergyOrder({
            orderId: orderId,
            trader: msg.sender,
            orderType: OrderType.Buy,
            energyAmount: _energyAmount,
            pricePerUnit: _pricePerUnit,
            timestamp: block.timestamp,
            status: OrderStatus.Open,
            filledBy: address(0),
            filledTimestamp: 0
        });
        
        orders.push(newOrder);
        userOrders[msg.sender].push(orderId);
        
        emit OrderCreated(orderId, msg.sender, OrderType.Buy, _energyAmount, _pricePerUnit);
        
        // Try to match with existing sell orders
        _matchOrders(orderId);
        
        return orderId;
    }
    
    /**
     * @dev Create a new sell order
     * @param _energyAmount Amount of energy to sell in Wh
     * @param _pricePerUnit Minimum price willing to accept per Wh
     */
    function createSellOrder(
        uint256 _energyAmount,
        uint256 _pricePerUnit
    ) external returns (uint256) {
        require(_energyAmount > 0, "Energy amount must be greater than 0");
        require(_pricePerUnit > 0, "Price per unit must be greater than 0");
        
        uint256 orderId = orders.length;
        
        EnergyOrder memory newOrder = EnergyOrder({
            orderId: orderId,
            trader: msg.sender,
            orderType: OrderType.Sell,
            energyAmount: _energyAmount,
            pricePerUnit: _pricePerUnit,
            timestamp: block.timestamp,
            status: OrderStatus.Open,
            filledBy: address(0),
            filledTimestamp: 0
        });
        
        orders.push(newOrder);
        userOrders[msg.sender].push(orderId);
        
        emit OrderCreated(orderId, msg.sender, OrderType.Sell, _energyAmount, _pricePerUnit);
        
        // Try to match with existing buy orders
        _matchOrders(orderId);
        
        return orderId;
    }
    
    /**
     * @dev Cancel an order
     * @param _orderId ID of the order to cancel
     */
    function cancelOrder(uint256 _orderId) external onlyOrderOwner(_orderId) {
        EnergyOrder storage order = orders[_orderId];
        
        require(order.status == OrderStatus.Open, "Order is not open");
        
        order.status = OrderStatus.Cancelled;
        
        // Refund buyer if it's a buy order
        if (order.orderType == OrderType.Buy) {
            uint256 refundAmount = order.energyAmount * order.pricePerUnit;
            payable(order.trader).transfer(refundAmount);
        }
        
        emit OrderCancelled(_orderId);
    }
    
    /**
     * @dev Fill a specific order
     * @param _orderId ID of the order to fill
     */
    function fillOrder(uint256 _orderId) external {
        EnergyOrder storage order = orders[_orderId];
        
        require(order.status == OrderStatus.Open, "Order is not open");
        require(order.trader != msg.sender, "Cannot fill your own order");
        
        if (order.orderType == OrderType.Buy) {
            // Seller is filling a buy order
            order.status = OrderStatus.Filled;
            order.filledBy = msg.sender;
            order.filledTimestamp = block.timestamp;
            
            // Create trade record
            _createTrade(order.orderId, type(uint256).max, order.trader, msg.sender, order.energyAmount, order.energyAmount * order.pricePerUnit);
            
            // Transfer payment to seller
            uint256 payment = order.energyAmount * order.pricePerUnit;
            payable(msg.sender).transfer(payment);
        } else {
            // Buyer is filling a sell order
            uint256 totalCost = order.energyAmount * order.pricePerUnit;
            require(msg.value >= totalCost, "Insufficient payment");
            
            order.status = OrderStatus.Filled;
            order.filledBy = msg.sender;
            order.filledTimestamp = block.timestamp;
            
            // Create trade record
            _createTrade(type(uint256).max, order.orderId, msg.sender, order.trader, order.energyAmount, totalCost);
            
            // Transfer payment to seller
            payable(order.trader).transfer(totalCost);
        }
        
        emit OrderFilled(_orderId, msg.sender);
    }
    
    /**
     * @dev Internal function to match orders
     * @param _newOrderId ID of the new order to match
     */
    function _matchOrders(uint256 _newOrderId) internal {
        EnergyOrder storage newOrder = orders[_newOrderId];
        
        // If order is already filled or cancelled, do nothing
        if (newOrder.status != OrderStatus.Open) {
            return;
        }
        
        // Find matching orders
        for (uint256 i = 0; i < orders.length; i++) {
            // Skip if same order, not open, or same trader
            if (i == _newOrderId || 
                orders[i].status != OrderStatus.Open || 
                orders[i].trader == newOrder.trader) {
                continue;
            }
            
            // Check if order types are complementary
            if ((newOrder.orderType == OrderType.Buy && orders[i].orderType == OrderType.Sell) ||
                (newOrder.orderType == OrderType.Sell && orders[i].orderType == OrderType.Buy)) {
                
                EnergyOrder storage existingOrder = orders[i];
                
                // Check if prices are compatible
                bool priceMatch = false;
                
                if (newOrder.orderType == OrderType.Buy) {
                    // Buy order price >= Sell order price
                    priceMatch = newOrder.pricePerUnit >= existingOrder.pricePerUnit;
                } else {
                    // Sell order price <= Buy order price
                    priceMatch = newOrder.pricePerUnit <= existingOrder.pricePerUnit;
                }
                
                if (priceMatch) {
                    // Match found, execute trade
                    uint256 tradeAmount = (newOrder.energyAmount < existingOrder.energyAmount) 
                        ? newOrder.energyAmount 
                        : existingOrder.energyAmount;
                    
                    // Determine price (use the existing order's price)
                    uint256 tradePrice = existingOrder.pricePerUnit;
                    uint256 totalCost = tradeAmount * tradePrice;
                    
                    // Update order statuses
                    newOrder.status = OrderStatus.Filled;
                    newOrder.filledBy = existingOrder.trader;
                    newOrder.filledTimestamp = block.timestamp;
                    
                    existingOrder.status = OrderStatus.Filled;
                    existingOrder.filledBy = newOrder.trader;
                    existingOrder.filledTimestamp = block.timestamp;
                    
                    // Create trade record
                    uint256 buyOrderId = (newOrder.orderType == OrderType.Buy) ? _newOrderId : i;
                    uint256 sellOrderId = (newOrder.orderType == OrderType.Sell) ? _newOrderId : i;
                    address buyer = orders[buyOrderId].trader;
                    address seller = orders[sellOrderId].trader;
                    
                    _createTrade(buyOrderId, sellOrderId, buyer, seller, tradeAmount, totalCost);
                    
                    // Transfer payment from buyer to seller
                    payable(seller).transfer(totalCost);
                    
                    // Refund excess to buyer if buy order
                    if (newOrder.orderType == OrderType.Buy) {
                        uint256 refund = (newOrder.energyAmount * newOrder.pricePerUnit) - totalCost;
                        if (refund > 0) {
                            payable(newOrder.trader).transfer(refund);
                        }
                    }
                    
                    // Emit events
                    emit OrderFilled(_newOrderId, existingOrder.trader);
                    emit OrderFilled(i, newOrder.trader);
                    
                    // Exit after first match
                    break;
                }
            }
        }
    }
    
    /**
     * @dev Internal function to create a trade record
     */
    function _createTrade(
        uint256 _buyOrderId,
        uint256 _sellOrderId,
        address _buyer,
        address _seller,
        uint256 _energyAmount,
        uint256 _totalPrice
    ) internal {
        uint256 tradeId = trades.length;
        
        Trade memory newTrade = Trade({
            tradeId: tradeId,
            buyOrderId: _buyOrderId,
            sellOrderId: _sellOrderId,
            buyer: _buyer,
            seller: _seller,
            energyAmount: _energyAmount,
            totalPrice: _totalPrice,
            timestamp: block.timestamp
        });
        
        trades.push(newTrade);
        
        // Add to users' trades
        userTrades[_buyer].push(tradeId);
        userTrades[_seller].push(tradeId);
        
        emit TradeExecuted(tradeId, _buyOrderId, _sellOrderId, _buyer, _seller, _energyAmount, _totalPrice);
    }
    
    /**
     * @dev Get all open orders
     * @return Array of open orders
     */
    function getOpenOrders() external view returns (EnergyOrder[] memory) {
        uint256 count = 0;
        
        // Count open orders
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].status == OrderStatus.Open) {
                count++;
            }
        }
        
        // Create result array
        EnergyOrder[] memory result = new EnergyOrder[](count);
        uint256 index = 0;
        
        // Fill result array
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].status == OrderStatus.Open) {
                result[index] = orders[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get user's orders
     * @param _user Address of the user
     * @return Array of order IDs
     */
    function getUserOrders(address _user) external view returns (uint256[] memory) {
        return userOrders[_user];
    }
    
    /**
     * @dev Get user's trades
     * @param _user Address of the user
     * @return Array of trade IDs
     */
    function getUserTrades(address _user) external view returns (uint256[] memory) {
        return userTrades[_user];
    }
    
    /**
     * @dev Get order details
     * @param _orderId ID of the order
     * @return Order details
     */
    function getOrderDetails(uint256 _orderId) external view returns (EnergyOrder memory) {
        require(_orderId < orders.length, "Order does not exist");
        return orders[_orderId];
    }
    
    /**
     * @dev Get trade details
     * @param _tradeId ID of the trade
     * @return Trade details
     */
    function getTradeDetails(uint256 _tradeId) external view returns (Trade memory) {
        require(_tradeId < trades.length, "Trade does not exist");
        return trades[_tradeId];
    }
}
