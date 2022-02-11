import React, { Component, createRef } from "react";
import { Stage, Layer, Group, Label, Text, Rect } from 'react-konva';

import logoTroyX from '../../assets/map.png';

import Images from "./Images";


class ImagePointGrid extends Component {

  constructor(props) {
    super(props);

    this.state = {
      image: logoTroyX,
      circleList: [],
      stageRef: createRef(null),
      stageWidth: 0,
      stageHeight: 0,
      imageClickCoordList: [],
      grid: [1,2,3,4],
      // grid: [1,2,3,4,5,6,7,8,9],
      // grid: [1,2,3,4,5,6,7,8,9,10,11],
    }
  }
  
  componentDidMount () {
    let jsonImageClickCoordList = JSON.parse(localStorage.getItem('imageClickCoordList'));
    if (jsonImageClickCoordList) {
      console.log(jsonImageClickCoordList);
      this.circleListAfterReload(jsonImageClickCoordList);
    } 
  }

  circleListAfterReload = (imageClickCoordList) => {

    let circleListTemp = [];
    imageClickCoordList.map((cur,index) => {

      let rowCount = 0;
      let colCount = 0;
      let colLimit = 2;
      let offsetInit = -8;
      let offsetDistance = 25;
      let x = 0;
      let y = 0;
      let offsetX = 0;
      let offsetY = 0;

      circleListTemp[index] = <Label 
          id={this.state.imageClickCoordList.length}
          x={cur.x}
          y={cur.y}
          onClick = {this.handleClickLabel}
        >
          {
            this.state.grid.map((cur,index) => {

              colCount += 1;
  
              let gridNo = index + 1;

              x = 25 * (colCount - 1);
              if (rowCount) {
                y = 25 * rowCount;
              }
              offsetX = offsetInit - (offsetDistance * (colCount - 1));
              offsetY = offsetInit - (offsetDistance * rowCount);

              if (!(gridNo%colLimit)) {
                rowCount += 1;
                colCount = 0;
              }

              console.log(rowCount, colCount)
              console.log(offsetX, offsetY);
              
              return (
                <>
                  <Rect
                    x={x}
                    y={y}
                    width={25}
                    height={25}
                    fill="red"
                    shadowBlur={5}
                  />
                  <Text text={gridNo} offsetX={offsetX} offsetY={offsetY} />
                </>
              )
            })
          }
        </Label>}
    )
    this.setState({
      circleList: [...circleListTemp],
      imageClickCoordList: [...imageClickCoordList]
    }, () => {
      localStorage.setItem('imageClickCoordList', JSON.stringify([...imageClickCoordList]));
    })
  }
  
  handleZoomStage = (event) => {

    const scaleBy = 1.01;

    event.evt.preventDefault();

    if (this.state.stageRef.current !== null) {

      const stage = this.state.stageRef.current;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      }
      stage.position(newPos);
      stage.batchDraw();

    }
    
  }

  render () {
    let { stageWidth , stageHeight } = this.state;

    stageWidth = window.innerWidth;
    stageHeight = window.innerHeight * 0.5;

    return (
      <>
        <Stage
          style={{backgroundColor: 'rgb(166, 162, 154)', overflow: 'hidden'}}
          width={stageWidth}
          height={stageHeight}
          draggable
          onWheel={this.handleZoomStage}
          ref={this.state.stageRef}
        >
          <Layer>
            <Group>
              <Images img={this.state.image} handleClickImage={''} />
              {this.state.circleList.length > 0 && this.state.circleList.map(curCircle=>curCircle) }
            </Group>
          </Layer>
        </Stage>

      </>
    )
  }

}

export default ImagePointGrid

