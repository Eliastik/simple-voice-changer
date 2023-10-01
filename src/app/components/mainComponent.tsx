"use client";

import HomeMenu from "./homeMenu/homeMenu";
import { useDispatch, connect } from "react-redux";

const MainComponent = ({
  principalAudioBlob
}: { principalAudioBlob: Blob | null }) => {
  return (
    <>
      {!principalAudioBlob && <HomeMenu></HomeMenu>}
      {principalAudioBlob && <span>Test</span>}
    </>
  )
};

const mapStateToProps = (state: any) => {
  return {
      principalAudioBlob: state.readFileReducer.principalAudioBlob
  };
};

export default connect(mapStateToProps)(MainComponent);