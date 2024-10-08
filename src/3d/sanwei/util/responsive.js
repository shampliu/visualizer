import Bowser from "bowser";

export const isTouchDevice = () => {
  if (typeof window !== "undefined" && navigator) {
    return (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    );
  }

  return false;
};

export let events = {};

if (isTouchDevice()) {
  events = {
    move: "touchmove",
    up: "touchend",
    down: "touchstart",
  };
} else {
  events = {
    move: "mousemove",
    up: "mouseup",
    down: "mousedown",
    wheel: "wheel",
  };
}

export const getPos = ({ changedTouches, clientX, clientY, target }) => {
  const x = changedTouches ? changedTouches[0].clientX : clientX;
  const y = changedTouches ? changedTouches[0].clientY : clientY;

  return {
    x,
    y,
    target,
  };
};

export const isSafari = () => {
  if (typeof window !== "undefined" && navigator) {
    return Bowser.getParser(navigator.userAgent).getBrowserName() === "Safari";
  }

  return false;
};

export const isChrome = () => {
  if (typeof window !== "undefined" && navigator) {
    return Bowser.getParser(navigator.userAgent).getBrowserName() === "Chrome";
  }

  return false;
};
