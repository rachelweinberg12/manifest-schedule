import { RefObject, useEffect, useLayoutEffect, useState } from "react";

export const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useSafeLayoutEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenWidth;
};

export const useElementPosition = (elementRef: RefObject<HTMLDivElement>) => {
  const [elementPosition, setElementPosition] = useState({
    left: 0,
    top: 0,
  });

  useSafeLayoutEffect(() => {
    const element = elementRef.current;

    const handleScroll = () => {
      if (elementRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = elementRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          console.log("Scrolled to the right end");
          // Add your logic here
        }
      }
    };

    elementRef.current?.addEventListener("scroll", handleScroll);
    // Clean up the event listener when the component unmounts
    return () => {
      elementRef.current?.removeEventListener("resize", handleScroll);
    };
  }, []);
  console.log("pos", elementPosition);

  return elementPosition;
};
