pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract YourContract {
    uint64 constant RIDE_FARE = 3560000000000000;
    // assuming 2$/km and 1 ETH = 3206.30$
    uint256 constant FARE_PER_METER = 1200000000000;
    uint256 constant MAX_TRIP_DISTANCE_METERS = 100 * 1000; // 100 KMs

    address public owner;

    Driver[] public onlineDrivers;

    struct Coordinate {
        int64 lat;
        int64 lon;
    }

    struct Driver {
        address driverAddress;
        Coordinate currentCoordinate;
        string licensePlate;
        uint256 updatedTime;
    }

    event Rides(
        address indexed rider,
        address indexed driver,
        string licensePlate,
        uint64 ride_fare,
        Coordinate src,
        Coordinate dest
    );

    constructor() {
        owner = msg.sender;
    }

    function getDriverCount() public view returns (uint256 count) {
        return onlineDrivers.length;
    }

    function resetAll() public {
        delete onlineDrivers;
    }

    function driverGoOnline(
        int64 lat,
        int64 lon,
        string memory licensePlate
    ) public {
        // check if the sender is already added as an online driver
        for (uint64 i = 0; i < onlineDrivers.length; i++) {
            require(onlineDrivers[i].driverAddress != msg.sender);
        }

        Driver memory driver = Driver(
            address(msg.sender),
            Coordinate(lat, lon),
            licensePlate,
            block.timestamp
        );
        onlineDrivers.push(driver);
    }

    // Finds an online driver and pays them for the ride
    function requestRide(
        int64 srcLat,
        int64 srcLon,
        int64 destLat,
        int64 destLon
    ) public payable {
        require(msg.value == RIDE_FARE, "Incorrect ride fare sent");
        require(onlineDrivers.length > 0, "No online drivers!");

        address rider = msg.sender;
        Coordinate memory src = Coordinate(srcLat, srcLon);
        Coordinate memory dest = Coordinate(destLat, destLon);

        Driver memory assignedDriver;
        bool matchMade;
        for (uint64 i = 0; i < onlineDrivers.length; i++) {
            if (onlineDrivers[i].driverAddress != rider) {
                assignedDriver = onlineDrivers[i];

                // remove assigned driver from online drivers
                onlineDrivers[i] = onlineDrivers[onlineDrivers.length - 1];
                delete onlineDrivers[onlineDrivers.length - 1];
                matchMade = true;
                break;
            }
        }
        require(matchMade, "No drivers found");
        emit Rides(
            msg.sender,
            assignedDriver.driverAddress,
            assignedDriver.licensePlate,
            RIDE_FARE,
            src,
            dest
        );
        payable(assignedDriver.driverAddress).transfer(RIDE_FARE);
    }

    function emitTestRidesEvent() public {
        emit Rides(
            msg.sender,
            msg.sender,
            "TSLA",
            RIDE_FARE,
            Coordinate(0, 0),
            Coordinate(0, 0)
        );
    }

    function destroySmartContract(address payable _to) public {
        require(msg.sender == owner, "You are not the owner");
        selfdestruct(_to);
    }

    function calculateFare(int64 srcLat,
            int64 srcLon,
            int64 destLat,
            int64 destLon) pure public returns (uint256) {
        require((srcLat > 0 && destLat > 0) || (srcLat < 0 && destLat < 0), "Too far away");
        require((srcLon > 0 && destLon > 0) || (srcLon < 0 && destLon < 0), "Too far away");

        uint256 totalDistance = calculateDistance(srcLat, srcLon, destLat, destLon);

        require(totalDistance < MAX_TRIP_DISTANCE_METERS, "This is longer than maximum allowed on the platform");
        return totalDistance * FARE_PER_METER;
    }

    // Solidity doesn't support floating point arithmetic,
    // so a very very bad approprimation to calculate distance between 2 coordinates
    // by assuming the coordinates are points on a 2D plane.
    //
    // TODO: use haversine calculation
    function calculateDistance(int64 srcLat,
        int64 srcLon,
        int64 destLat,
        int64 destLon) pure public returns (uint256) {
        return sqrt(
            uint64(
                (srcLat - destLat) ** 2 + (srcLon - destLon) ** 2)
            );
    }

    // https://github.com/ethereum/dapp-bin/pull/50/files#diff-1299fb627c75a0a4367a211d8260694a198bf6d45efd5f0b3e8322b396412e0dR28
    function sqrt(uint256 x) pure private returns (uint256 y)  {
        if (x == 0) return 0;
        else if (x <= 3) return 1;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y)
        /// @why3 invariant { to_int !_z = div ((div (to_int arg_x) (to_int !_y)) + (to_int !_y)) 2 }
        /// @why3 invariant { to_int arg_x < (to_int !_y + 1) * (to_int !_y + 1) }
        /// @why3 invariant { to_int arg_x < (to_int !_z + 1) * (to_int !_z + 1) }
        /// @why3 variant { to_int !_y }
        {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
