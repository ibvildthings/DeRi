import React, { useCallback, useEffect } from 'react';

import { Button, SHAPE  } from "baseui/button";

// On Job state
function OnJob({onJobComplete, rideInfo}) {

  var pickUpLat = rideInfo[4][0] * 0.001;
  var pickUpLong = rideInfo[4][1] * 0.001;
  var destLat = rideInfo[5][0]* 0.001;
  var destLong = rideInfo[5][1] * 0.001;

  // var pickUpLat = 37.7577;
  // var pickUpLong = -122.4376;
  // var destLat = 37.7577;
  // var destLong = -122.4376;

  const handleJobComplete = useCallback( () => {
    onJobComplete(false) // False to set rider found to false
  }, [onJobComplete])


  function pickUpRiderClicked() {
    console.log("Picking up rider" + rideInfo)
    window.open("https://maps.google.com?q="+pickUpLat+","+pickUpLong );
  }

  function startTripClicked() {
    console.log("Starting trip")
    window.open("https://maps.google.com?q="+destLat+","+destLong );
  }

  return (
    <div>
      {/* Navigate to Rider button */}
      <Button 
        overrides={{BaseButton: {style: {width: '30%', marginRight: '5%'}}}}
        shape={SHAPE.pill}
        onClick={pickUpRiderClicked} >
        Pick Up Rider
      </Button>

      {/* Navigate to Destination button */}
      <Button 
        overrides={{BaseButton: {style: {width: '30%', marginRight: '5%'}}}}
        shape={SHAPE.pill}
        onClick={startTripClicked} >
        Start Trip
      </Button>

      {/* Job Complete button */}
      <Button 
        overrides={{BaseButton: {style: {width: '30%'}}}}
        shape={SHAPE.pill}
        onClick={handleJobComplete} >
        Complete Trip
      </Button>
    </div>
  );
};

export default OnJob;