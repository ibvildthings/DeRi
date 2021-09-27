import React, { useCallback, useState } from 'react';

import { Button, SHAPE } from "baseui/button";
import { Input } from "baseui/input";

// Go online button
function GoOnline({ isOnline, onIsOnlineChange,
  tx,
  writeContracts,
}) {

  const [licensePlate, setLicensePlate] = useState('');

  const handleSetOnline = useCallback(() => {
    onIsOnlineChange(true)
  }, [onIsOnlineChange])

  // device location succissfully obtained
  function positionSuccess(position) {
    console.log("Latitude is :", position.coords.latitude);
    console.log("Longitude is :", position.coords.longitude);

    let [lat, long] = [Math.round(position.coords.latitude * 10 ** 3), Math.round(position.coords.longitude * 10 ** 3)]

    console.log("Set Latitude as:", lat);
    console.log("Set Longitude as:", long);
    console.log("Set License plate as:", licensePlate);

    // Set the lat / long and license to the blockchain
    solidityTransaction(lat, long, licensePlate);
  }

  // If there is an error in retrieving the device location
  function positionError(err) {
    console.log(`Error: ${err}`)

    // Post defualt jsut incase
    solidityTransaction(37778, -122418, "A1B 3C4");
  }

  // Go Online button clicked
  function goOnlineClicked() {

    // let [lat, long] = [0, 0]

    // // Step 1: Get location of the driver
    // if (navigator.geolocation) {
    //   navigator.permissions
    //     .query({ name: "geolocation" })
    //     .then(function (result) {
    //       console.log(result.state);

    //       if (result.state === "granted") {

    //         // Get device location
    //         navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

    //       } else if (result.state === "prompt") {
    //         // Prompt is shown

    //       } else if (result.state === "denied") {
    //         // Denied. Try to manually allow location.
    //       }
    //       result.onchange = function () {
    //         console.log(result.state);
    //       };
    //     });
    // } else {
    //   alert("Sorry Not available!");
    // }

    solidityTransaction(37778, -122418, "A1B 3C4");
    // Set the user online
    handleSetOnline();
  }

  function solidityTransaction(lat, long, licensePlate) {

    const result = tx(writeContracts['YourContract'].driverGoOnline(lat, long, licensePlate, { gasLimit: 610000 }), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
      }
    });

    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(result);
  }

  return (
    <div>
      <Input
        value={licensePlate}
        onChange={e => setLicensePlate(e.target.value)}
        placeholder="Please Enter your License Plate"
      />

      <br />

      {/* Go Online button */}
      <Button
        overrides={{ BaseButton: { style: { width: '100%' } } }}
        shape={SHAPE.pill}
        onClick={goOnlineClicked} >
        Go Online!
      </Button>
    </div>
  );
};

export default GoOnline;