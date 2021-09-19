import React, { useEffect, useState } from 'react';

import Geocode from "react-geocode";

import { Spinner } from "baseui/spinner";
Geocode.setApiKey("AIzaSyBvItWOP-p9FAJ3eaSswnikODYmSovRwLo");


// OnTrip Step
function OnTrip({ pickUp, dest,
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

  // for useEffect 
  const [seconds, setSeconds] = useState(600);
  var pickUpLatLong = []
  var destLatLong = []
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
        pickUpLatLong = [Math.round(lat * 10 ** 3), Math.round(lng * 10 ** 3)]
        console.log("pickup lat long: ", lat, lng);

        Geocode.fromAddress(dest).then(
          (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            destLatLong = [Math.round(lat * 10 ** 3), Math.round(lng * 10 ** 3)]
            console.log("dest lat long: ", lat, lng);

            // Set the src and dest lat long to the blockchain
            const result = tx(writeContracts.YourContract.requestRide(pickUpLatLong[0], pickUpLatLong[1], destLatLong[0], destLatLong[1], { gasLimit: 6100000 }), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
              }
            });
            console.log("awaiting metamask/web3 confirm result...", result);
            console.log(result);
          },
          (error) => {
            console.error(error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    )

  }, []);

  useEffect(() => {
    let interval = null;
    if (seconds > 0) {
      // Count down until 0 seconds
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    }

    // check events
    if (RidesEvents) {
      RidesEvents.reverse().forEach(ride => {
        if (address == ride.args[0]) {
          setLicensePlate(ride.args[2]);
          handleDriverFound(ride.args[2]);
        }
      }
      )
    };

    return () => clearInterval(interval);

  }, [seconds]);

  return (
    <div>
      {licensePlate.length > 0 ? <div> Looking for Driver... <Spinner /></div> : <div> Driver is coming: {licensePlate} </div>}
    </div>
  );
};

export default OnTrip;