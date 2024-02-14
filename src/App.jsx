import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import twitterLogo from "./assets/twitter-logo.png";
import "./App.css";

// Constants
const TWITTER_HANDLE = "go_dr5";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjBwZjZhMGd0YjN4cXVleHBpM3l1Y3Nvd3N1NzJ6a3l0ZXc2cDQ2ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ispEc1253326c/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWNzNnU3aGkyc3NkanNyOG52MXo5b2ZyNmM3aHo5d3lmazVndTdybSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nzCDqg3pNqg7K/giphy.gif",
  "https://i.gifer.com/d0.gif",
  "https://i.gifer.com/1tn.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2d6aWt1bGFpMTN5YnoyY2lsZTYya2lwenpmZDlyM3hhbWNxaWN1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HyOOyynWxMxig/giphy.gif",
  "https://i.gifer.com/7D2.gif",
];
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);
  const fadeProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log("Phantom wallet found!");
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log("Connected with Public Key:", response.publicKey.toString());

      /*
       * Set the user's publicKey in state to be used later!
       */
      setWalletAddress(response.publicKey.toString());
    } else {
      alert("Solana object not found! Get a Phantom Wallet 👻");
    }
  };
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        const response = await solana.connect();
        console.log(
          "Connected with Public Key:",
          response.publicKey.toString()
        );
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      if (error.message === "User rejected the request") {
        console.log("User rejected the wallet connection request");
        // Display a user-friendly message or take appropriate action
      } else {
        console.error("Error connecting wallet:", error.message);
        // Handle other errors accordingly
      }
    }
  };
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Empty input. Try again.");
    }
  };
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          value={inputValue}
          onChange={onInputChange}
          type="text"
          placeholder="Enter gif link!"
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <animated.div style={fadeProps} className="connected-container">
      <div className="App">
        <div className={walletAddress ? "authed-container" : "container"}>
          <div className="container">
            <div className="header-container">
              <br />
              <p className={walletAddress ? "" : "header"}>👹 Katana GIFs </p>
              <p className="sub-text">Unsheathing the Essence of Anime✨</p>
            </div>
            <center>
              <div className="btn-container">
                {" "}
                {!walletAddress && renderNotConnectedContainer()}
              </div>
            </center>
            <div className={walletAddress ? "gif-container" : ""}>
              {walletAddress && renderConnectedContainer()}
            </div>

            <div
              className={walletAddress ? "foot_contain" : "footer-container"}
            >
              <img
                alt="Twitter Logo"
                className="twitter-logo"
                src={twitterLogo}
              />
              <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
              >{`built by @${TWITTER_HANDLE}`}</a>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default App;
