// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title BatteryLeasing
 * @dev Smart contract for managing battery leases in the ChargeX ecosystem
 */
contract BatteryLeasing {
    // Enum for lease status
    enum LeaseStatus { Active, Completed, Cancelled }
    
    // Struct for battery details
    struct Battery {
        string serialNumber;
        address owner;
        uint256 capacity;
        uint256 dailyRate;
        bool isAvailable;
    }
    
    // Struct for lease details
    struct Lease {
        uint256 batteryId;
        address lessor;
        address lessee;
        uint256 startTime;
        uint256 endTime;
        uint256 totalAmount;
        uint256 deposit;
        LeaseStatus status;
    }
    
    // State variables
    Battery[] public batteries;
    Lease[] public leases;
    
    // Mapping from battery ID to its index in the batteries array
    mapping(uint256 => uint256) private batteryIndex;
    
    // Mapping from user address to their leases
    mapping(address => uint256[]) private userLeases;
    
    // Events
    event BatteryRegistered(uint256 indexed batteryId, string serialNumber, address owner);
    event BatteryUpdated(uint256 indexed batteryId, uint256 dailyRate, bool isAvailable);
    event LeaseCreated(uint256 indexed leaseId, uint256 batteryId, address lessor, address lessee, uint256 startTime, uint256 endTime);
    event LeaseCompleted(uint256 indexed leaseId, uint256 batteryId);
    event LeaseCancelled(uint256 indexed leaseId, uint256 batteryId);
    
    // Modifiers
    modifier onlyBatteryOwner(uint256 _batteryId) {
        require(
            batteries[batteryIndex[_batteryId]].owner == msg.sender,
            "Only the battery owner can perform this action"
        );
        _;
    }
    
    modifier onlyLessee(uint256 _leaseId) {
        require(
            leases[_leaseId].lessee == msg.sender,
            "Only the lessee can perform this action"
        );
        _;
    }
    
    /**
     * @dev Register a new battery
     * @param _serialNumber Serial number of the battery
     * @param _capacity Capacity of the battery in Wh
     * @param _dailyRate Daily rate for leasing the battery
     */
    function registerBattery(
        string memory _serialNumber,
        uint256 _capacity,
        uint256 _dailyRate
    ) external returns (uint256) {
        uint256 batteryId = uint256(keccak256(abi.encodePacked(_serialNumber, msg.sender, block.timestamp)));
        
        Battery memory newBattery = Battery({
            serialNumber: _serialNumber,
            owner: msg.sender,
            capacity: _capacity,
            dailyRate: _dailyRate,
            isAvailable: true
        });
        
        batteries.push(newBattery);
        batteryIndex[batteryId] = batteries.length - 1;
        
        emit BatteryRegistered(batteryId, _serialNumber, msg.sender);
        
        return batteryId;
    }
    
    /**
     * @dev Update battery details
     * @param _batteryId ID of the battery
     * @param _dailyRate New daily rate for leasing
     * @param _isAvailable Whether the battery is available for lease
     */
    function updateBattery(
        uint256 _batteryId,
        uint256 _dailyRate,
        bool _isAvailable
    ) external onlyBatteryOwner(_batteryId) {
        uint256 index = batteryIndex[_batteryId];
        batteries[index].dailyRate = _dailyRate;
        batteries[index].isAvailable = _isAvailable;
        
        emit BatteryUpdated(_batteryId, _dailyRate, _isAvailable);
    }
    
    /**
     * @dev Create a new lease
     * @param _batteryId ID of the battery to lease
     * @param _endTime End time of the lease (Unix timestamp)
     */
    function createLease(
        uint256 _batteryId,
        uint256 _endTime
    ) external payable returns (uint256) {
        uint256 index = batteryIndex[_batteryId];
        Battery storage battery = batteries[index];
        
        require(battery.isAvailable, "Battery is not available for lease");
        require(_endTime > block.timestamp, "End time must be in the future");
        
        uint256 leaseDuration = (_endTime - block.timestamp) / 86400; // Convert to days
        uint256 leaseAmount = leaseDuration * battery.dailyRate;
        uint256 deposit = leaseAmount / 2; // 50% deposit
        
        require(msg.value >= leaseAmount + deposit, "Insufficient payment");
        
        // Create lease
        Lease memory newLease = Lease({
            batteryId: _batteryId,
            lessor: battery.owner,
            lessee: msg.sender,
            startTime: block.timestamp,
            endTime: _endTime,
            totalAmount: leaseAmount,
            deposit: deposit,
            status: LeaseStatus.Active
        });
        
        // Update battery availability
        battery.isAvailable = false;
        
        // Add lease to storage
        leases.push(newLease);
        uint256 leaseId = leases.length - 1;
        
        // Add to user's leases
        userLeases[msg.sender].push(leaseId);
        
        // Transfer lease amount to battery owner
        payable(battery.owner).transfer(leaseAmount);
        
        emit LeaseCreated(leaseId, _batteryId, battery.owner, msg.sender, block.timestamp, _endTime);
        
        return leaseId;
    }
    
    /**
     * @dev Complete a lease
     * @param _leaseId ID of the lease to complete
     */
    function completeLease(uint256 _leaseId) external {
        Lease storage lease = leases[_leaseId];
        
        require(lease.status == LeaseStatus.Active, "Lease is not active");
        require(
            lease.lessor == msg.sender || lease.lessee == msg.sender,
            "Only lessor or lessee can complete the lease"
        );
        
        // Update lease status
        lease.status = LeaseStatus.Completed;
        
        // Make battery available again
        uint256 index = batteryIndex[lease.batteryId];
        batteries[index].isAvailable = true;
        
        // Return deposit to lessee if returned on time
        if (block.timestamp <= lease.endTime) {
            payable(lease.lessee).transfer(lease.deposit);
        } else {
            // If late, send deposit to lessor as compensation
            payable(lease.lessor).transfer(lease.deposit);
        }
        
        emit LeaseCompleted(_leaseId, lease.batteryId);
    }
    
    /**
     * @dev Cancel a lease (only possible by lessor or if overdue)
     * @param _leaseId ID of the lease to cancel
     */
    function cancelLease(uint256 _leaseId) external {
        Lease storage lease = leases[_leaseId];
        
        require(lease.status == LeaseStatus.Active, "Lease is not active");
        require(
            lease.lessor == msg.sender || block.timestamp > lease.endTime + 7 days,
            "Only lessor can cancel or lease must be overdue by 7 days"
        );
        
        // Update lease status
        lease.status = LeaseStatus.Cancelled;
        
        // Make battery available again
        uint256 index = batteryIndex[lease.batteryId];
        batteries[index].isAvailable = true;
        
        // If cancelled by lessor before end time, return deposit to lessee
        if (lease.lessor == msg.sender && block.timestamp < lease.endTime) {
            payable(lease.lessee).transfer(lease.deposit);
        } else {
            // If overdue, send deposit to lessor
            payable(lease.lessor).transfer(lease.deposit);
        }
        
        emit LeaseCancelled(_leaseId, lease.batteryId);
    }
    
    /**
     * @dev Get all batteries
     * @return Array of all batteries
     */
    function getAllBatteries() external view returns (Battery[] memory) {
        return batteries;
    }
    
    /**
     * @dev Get available batteries
     * @return Array of available batteries
     */
    function getAvailableBatteries() external view returns (Battery[] memory) {
        uint256 count = 0;
        
        // Count available batteries
        for (uint256 i = 0; i < batteries.length; i++) {
            if (batteries[i].isAvailable) {
                count++;
            }
        }
        
        // Create result array
        Battery[] memory result = new Battery[](count);
        uint256 index = 0;
        
        // Fill result array
        for (uint256 i = 0; i < batteries.length; i++) {
            if (batteries[i].isAvailable) {
                result[index] = batteries[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get user's leases
     * @param _user Address of the user
     * @return Array of lease IDs
     */
    function getUserLeases(address _user) external view returns (uint256[] memory) {
        return userLeases[_user];
    }
    
    /**
     * @dev Get lease details
     * @param _leaseId ID of the lease
     * @return Lease details
     */
    function getLeaseDetails(uint256 _leaseId) external view returns (Lease memory) {
        require(_leaseId < leases.length, "Lease does not exist");
        return leases[_leaseId];
    }
}
