pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract YourContract {
    uint256 constant RIDE_FARE = 1;

    address public owner;

    Driver[] public onlineDrivers;

    struct Coordinate {
        int256 lat;
        int256 lon;
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
        uint256 ride_fare,
        Coordinate src,
        Coordinate dest
    );
    event SetPurpose(address sender, string purpose);

    string public purpose = "Building Unstoppable Apps!!!";

    constructor() {
        owner = msg.sender;
    }

    function setPurpose(string memory newPurpose) public {
        purpose = newPurpose;
        console.log(msg.sender, "set purpose to", purpose);
        emit SetPurpose(msg.sender, purpose);
    }

    function getDriverCount() public view returns (uint256 count) {
        return onlineDrivers.length;
    }

    function resetAll() public {
        delete onlineDrivers;
    }

    function driverGoOnline(
        int256 lat,
        int256 lon,
        string memory licensePlate
    ) public {
        // check if the sender is already added as an online driver
        for (uint256 i = 0; i < onlineDrivers.length; i++) {
            if (onlineDrivers[i].driverAddress != msg.sender) {
                return;
            }
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
        int256 srcLat,
        int256 srcLon,
        int256 destLat,
        int256 destLon
    ) public payable {
        require(onlineDrivers.length > 0, "No online drivers!");

        address rider = msg.sender;
        Coordinate memory src = Coordinate(srcLat, srcLon);
        Coordinate memory dest = Coordinate(destLat, destLon);

        Driver memory assignedDriver;
        bool matchMade;
        for (uint256 i = 0; i < onlineDrivers.length; i++) {
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
}
