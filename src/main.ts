import Renderer from "./graphics/renderer";
import { Controller } from './ui/controller'
import {Vector2, Vector3} from "./math/vector";

import "./style.css"

async function main() {
    
    const controller: Controller = Controller.getInstance();
    controller.bindEvents();

    const renderer: Renderer = Renderer.getInstance();
    
    let previous = 0;

    const roopAnimation = (current: number) => {
        const deltaTime = (current - previous) * 0.001;
        previous = current;
        //console.log(deltaTime);
      // poll events

      // update
        renderer.update(controller.renderingStates, deltaTime);

      // render
        renderer.render(controller.renderingStates, deltaTime);

        requestAnimationFrame(roopAnimation);
    }

    if (await renderer.setup())
    {
        requestAnimationFrame(roopAnimation);
    }
}

main();