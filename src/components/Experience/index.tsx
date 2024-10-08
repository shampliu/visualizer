"use client";

import { Manager } from '@/3d/sanwei'
import { useEffect, useRef } from "react";
import { MainScene } from "@/3d/scenes/Scene1";


export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const init = async () => {
    await Manager.init(containerRef.current);
  
    const mainScene = new MainScene();
    await mainScene.init();
    Manager.scenes.push(mainScene);


  }

  useEffect(() => {
    init();


  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-full" />
  );
};
