import Renderer from "./renderer";

import "./style.css"


function main() {
  
  const renderer: Renderer = new Renderer();
  

  const roopAnimation = () => {

    // poll events

    // update
    renderer.update();

    // render
    renderer.render();

    requestAnimationFrame(roopAnimation);
  }

  if (renderer.init())
  {
    requestAnimationFrame(roopAnimation);
  }
}

main();