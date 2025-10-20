"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const app = new PIXI.Application();

      (async () => {
        await app.init({ resizeTo: window, backgroundColor: 0x1099bb });

        if (ref.current && ref.current.children.length === 0) {
          ref.current.appendChild(app.view as unknown as Node);
        }

        // Load the textures
        const backgroundTexture = await PIXI.Assets.load("/background.png");
        const bunnyTexture = await PIXI.Assets.load("/bunny.png");

        // Create the background sprite
        const background = new PIXI.Sprite(backgroundTexture);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // Create the bunny sprite
        const bunny = new PIXI.Sprite(bunnyTexture);
        bunny.anchor.set(0.5);
        bunny.x = app.screen.width / 2;
        bunny.y = app.screen.height / 2;
        app.stage.addChild(bunny);

        // Keyboard controls
        const keys: { [key: string]: boolean } = {};
        const speed = 5;

        window.addEventListener("keydown", (e) => {
          keys[e.key] = true;
        });

        window.addEventListener("keyup", (e) => {
          keys[e.key] = false;
        });

        app.ticker.add(() => {
          const delta = app.ticker.deltaTime;
          if (keys["ArrowUp"]) {
            bunny.y -= speed * delta;
          }
          if (keys["ArrowDown"]) {
            bunny.y += speed * delta;
          }
          if (keys["ArrowLeft"]) {
            bunny.x -= speed * delta;
          }
          if (keys["ArrowRight"]) {
            bunny.x += speed * delta;
          }
        });
      })();

      return () => {
        app.destroy(true, true);
      };
    }
  }, []);

  return <div ref={ref} />;
}