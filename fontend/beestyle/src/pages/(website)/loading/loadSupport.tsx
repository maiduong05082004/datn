import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="box-load1" />
        <div className="box-load2" />
        <div className="box-load3" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    transition: all 0.4s;
  }

  .loader div {
    margin-left: 2px;
    background-color: rgb(34, 34, 34);
    box-shadow: inset 2px 2px 10px black;
    border-radius: 100%;
    height: 7.5px;
    width: 7.5px;
  }

  .box-load1 {
    animation: brighten 1.2s infinite;
  }

  .box-load2 {
    animation: brighten 1.2s infinite;
    animation-delay: .2s;
  }

  .box-load3 {
    animation: brighten 1.2s infinite;
    animation-delay: .4s;
  }

  @keyframes brighten {
    100% {
      background-color: rgb(165, 165, 165);
      box-shadow: none;
    }
  }`;

export default Loader;
