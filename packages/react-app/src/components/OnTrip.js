import React, { useEffect, useState } from 'react';

import Geocode from "react-geocode";

import { Spinner } from "baseui/spinner";
Geocode.setApiKey("AIzaSyBvItWOP-p9FAJ3eaSswnikODYmSovRwLo");


// OnTrip Step
function OnTrip({pickUp, dest,
  RidesEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [pickUpLatLong, setPickUpLatLong] = useState([0,0])
  const [destLatLong, setDestLatLong] = useState([0,0])
  const [licensePlate, setLicensePlate] = useState('')

  const handleDriverFound = (plate) => {
    setLicensePlate(plate)
  }

  // Geocode the addresses and send to chain

  useEffect(() => {
    // Get latitude & longitude from address.

    Geocode.fromAddress(pickUp).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setPickUpLatLong([lat * 10 ** 3, lng * 10 ** 3])
        console.log("pickup lat long: ", lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );

    Geocode.fromAddress(dest).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setDestLatLong([lat * 10 ** 3, lng * 10 ** 3])
        console.log("dest lat long: ", lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );


    // Set the src and dest lat long to the blockchain
    const result = tx(writeContracts.YourContract.requestRide(pickUpLatLong[0], pickUpLatLong[1], destLatLong[0], destLatLong[1], { gasLimit: 6100000 }), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(result);

    // Add event Listener (only do this once)
    // This is really bad I know but we have like 20 more min in the hackathon LOL
    while(true) {
      // check events
      if (RidesEvents) {
        RidesEvents.forEach(ride => {
          if (address == ride.args[0]) {
            setLicensePlate(ride.args[2]);
            handleDriverFound(ride.args[2]);
          }
        }
      )};
    }

  }, []);

  return (
    <div>
      {licensePlate.length > 0 ? <div> Looking for Driver... <Spinner/></div> : <div> Driver is coming: {licensePlate} </div>}
    </div>
  );
};

export default OnTrip;