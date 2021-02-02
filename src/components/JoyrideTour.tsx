import * as React from "react";
import JoyRide, { CallBackProps, STATUS } from "react-joyride";
import Tour from "../classes/Tours";
import { getSetting, setSetting } from "../middleware/Storage";

const { useState, useEffect } = React;

const JoyrideTour: React.FC<{
  tour: Tour;
}> = (props) => {
  const [show, setShow] = useState(false);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setShow(false);
      setSetting(props.tour.name, false);
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      let setting = await getSetting(props.tour.name);
      if (setting === undefined) setting = true;

      // skipped or finished?
      if (!setting) return;

      setShow(true);
    }, 500);
  }, [props.tour.name]);

  return (
    <>
      <JoyRide
        steps={props.tour.steps}
        run={show}
        callback={handleJoyrideCallback}
        showSkipButton
        continuous
        locale={{
          back: "Zurück",
          next: "Weiter",
          close: "Schließen",
          last: "Fertig",
          open: "Öffnen",
          skip: "Überspringen",
        }}
        styles={{
          options: {
            primaryColor: "#6a64ff",
          },
        }}
      />
    </>
  );
};

export default JoyrideTour;
