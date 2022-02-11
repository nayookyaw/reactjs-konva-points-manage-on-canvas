import React, { Component, createRef } from "react";
import { Stage, Layer, Group, Circle, Label, Text } from 'react-konva';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import logoTroyX from '../../assets/map.png';

import Images from "./Images";

class ImagePoint extends Component {

  constructor(props) {
    super(props);

    this.state = {
      image: logoTroyX,
      circleList: [],
      stageRef: createRef(null),
      stageWidth: 0,
      stageHeight: 0,
      showModal: false,
      deleteCircleList: [],
      imageClickCoordList: []
    }

    this.confirmDelete = this.confirmDelete.bind(this);
  }
  
  componentDidMount () {
    let jsonImageClickCoordList = JSON.parse(localStorage.getItem('imageClickCoordList'));
    if (jsonImageClickCoordList) {
      console.log(jsonImageClickCoordList);
      this.circleListAfterDeleteReload(jsonImageClickCoordList);
    }
  }

  circleListAfterDeleteReload = (imageClickCoordList) => {
    let circleListTemp = [];
    imageClickCoordList.map((cur,index) => circleListTemp[index] = <Label 
          id={index+1}
          x={cur.x}
          y={cur.y}
          draggable
          onClick = {this.handleClickLabel}
          onDragEnd={this.handleDragLabelCoordination}
        >
          <Circle
            width={25}
            height={25}
            fill="red"
            shadowBlur={5}
          />
          <Text text={index+1} offsetX={3} offsetY={3} />
        </Label>
    )
    this.setState({
      circleList: [...circleListTemp],
      imageClickCoordList: [...imageClickCoordList]
    }, () => {
      localStorage.setItem('imageClickCoordList', JSON.stringify([...imageClickCoordList]));
    })
  }

  calculateCoordination = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const offset = {x: stage.x(), y: stage.y()};

    const imageClickX = (pointerPosition.x - offset.x) * (1/stage.scaleX());
    const imageClickY = (pointerPosition.y - offset.y) * (1/stage.scaleX());

    return {x: imageClickX, y: imageClickY};
  }

  handleDragLabelCoordination = (e) => {

    let {x, y} = this.calculateCoordination(e);

    let id = 0;
    let nodes = e.target.findAncestors('Label', true);
    if (nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++){
        id = nodes[i].getAttr("id")              
      }
    } else {
      id = parseInt(e.target.id());
    }

    this.state.imageClickCoordList[id-1] = {x, y};
    localStorage.setItem('imageClickCoordList', JSON.stringify([...this.state.imageClickCoordList]));

  }
  
  handleClickImage = (e) => {
   
    let {x, y}= this.calculateCoordination(e);

    // do stuff
    this.setState({
      imageClickCoordList: [...this.state.imageClickCoordList, {x, y}],
    }, () => {
      this.setState({
        circleList: [...this.state.circleList, 
          <Label 
            id={this.state.imageClickCoordList.length}
            x={x}
            y={y}
            draggable
            onClick = {this.handleClickLabel}
            onDragEnd={this.handleDragLabelCoordination}
          >
            <Circle
              width={25}
              height={25}
              fill="red"
              shadowBlur={5}
            />
            <Text text={this.state.imageClickCoordList.length } offsetX={3} offsetY={3} />
          </Label>
        ]
      }, () => {
        localStorage.setItem('imageClickCoordList', JSON.stringify([...this.state.imageClickCoordList]));
      })
    })
  
  }

  handleClickLabel = (e) => {
    console.log ("click label haha");
    console.log (e);
    // // https://stackoverflow.com/questions/64473531/how-to-obtain-id-of-konva-label-from-konvas-dblclick-event
    // let nodes = e.target.findAncestors('Label', true);
    // if (nodes.length > 0) {
    //   for (let i = 0; i < nodes.length; i++){
    //     let id = nodes[i].getAttr("id")              
    //     console.log('shape ' + i + ' ID (dblclick)', id )
    //   }
    // } else {
    //       console.log('ID (dblclick) = ' + parseInt(e.target.id()));
    // }
  }

  confirmDelete() {
    console.log(this.state.circleList);
    this.setState({
      deleteCircleList : []
    }, () => {
      console.log(this.state.deleteCircleList);
      this.modalToggle();
    });

  }

  confirmModalCircleDelete = () => {
    for (let deleteCircle of this.state.deleteCircleList) {

      let alreadyGreaterDeleteCircle = [];
      let alreadySmallerDeleteCircle = [];

      for (let i=0; i<this.state.deleteCircleList.length; i++) {

        if (this.state.deleteCircleList[i] == deleteCircle) {
          break;
        }

        if (this.state.deleteCircleList[i] > deleteCircle) {
          alreadyGreaterDeleteCircle.push(this.state.deleteCircleList[i]);
        } else {
          alreadySmallerDeleteCircle.push(this.state.deleteCircleList[i]);
        }

      }

      console.log(alreadyGreaterDeleteCircle);
      console.log(alreadySmallerDeleteCircle);

      let deleteCircleIndex = deleteCircle - 1;

      // if (alreadyGreaterDeleteCircle.length > 0) {
      //   deleteCircleIndex = deleteCircleIndex - alreadyGreaterDeleteCircle.length;
      // }
      
      if (alreadySmallerDeleteCircle.length > 0) {
        deleteCircleIndex = deleteCircleIndex - alreadySmallerDeleteCircle.length;
      }
      
      this.state.imageClickCoordList.splice(deleteCircleIndex, 1);

    }

    this.circleListAfterDeleteReload(this.state.imageClickCoordList);
    
    this.modalToggle();
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

  modalToggle = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  toggleCheckboxHandler = (delete_circle) => () => {

    // https://stackoverflow.com/questions/66434403/how-to-get-multiple-checkbox-values-in-react-js

    const index = this.state.deleteCircleList.indexOf(delete_circle);

    if (index > -1) {

      this.state.deleteCircleList.splice(index, 1);

    } else {

      this.setState({
        deleteCircleList : [
          ...this.state.deleteCircleList,
          delete_circle
        ]
      }, () => console.log(this.state.deleteCircleList));
    }

  };

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
              <Images img={this.state.image} handleClickImage={this.handleClickImage} />
              {this.state.circleList.length > 0 && this.state.circleList.map(curCircle=>curCircle) }
            </Group>
          </Layer>
        </Stage>
        <button onClick={this.confirmDelete}>Delete</button>

        <Modal isOpen={this.state.showModal} toggle={this.modalToggle} className={this.props.className}>
          <ModalHeader toggle={this.modalToggle}>Delete Circle Point</ModalHeader>
          <ModalBody>
            <ul>
            {
              this.state.circleList.map((cur, index) => <CirclePointList 
                key={index} 
                label={index+1} 
                toggleCheckboxHandler={this.toggleCheckboxHandler}
                deleteCircleList={this.state.deleteCircleList} />)
            }
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.confirmModalCircleDelete}>Delete</Button>{' '}
            <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }

}

class CirclePointList extends Component {
  render () {
    return <li style={{'listStyleType': 'none'}}>
      <input 
        type="checkbox" 
        style={{'marginRight': '15px'}} 
        onChange={this.props.toggleCheckboxHandler(this.props.label)}
        // checked={this.props.deleteCircleList.indexOf(this.props.label) > -1}
         />   
      Circle Point {this.props.label} </li>
  }
}

export default ImagePoint

