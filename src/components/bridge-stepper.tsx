import {Stepper} from "@mantine/core";

export default function BridgeStepper(props: any) {
  return (
    <>
      <Stepper active={props.step} breakpoint="sm">
        <Stepper.Step label="Select collection" />
        <Stepper.Step label="Select NFT" />
        <Stepper.Step label="Send NFT" />
        <Stepper.Step label="Wait" />
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </>
  );
}