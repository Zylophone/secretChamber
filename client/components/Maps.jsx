import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import axios from 'axios';

class Map extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pinCtr: 0,
      allPins: [
      ]
    }
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
    this.dropPin = this.dropPin.bind(this);
  }
  onMarkerClick (e) {
    console.log(this.state.infoWindowShow);
    this.setState({
      infoWindowShow: true
    });
    console.log(this.state.infoWindowShow);
  }
  closeInfo (e) {
    console.log('Hello');
  }

  dropPin (e) {
    this.props.submit();
    const pins = [];
    const pinPosition = {
      name: this.props.name,
      issue: this.props.issue,
      position: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    }
    const allPins = this.state.allPins.slice();
    allPins.push(<Marker key={this.state.pinCtr} {...pinPosition}>
      <InfoWindow content={'Marker Info Goes In This Box'}/>
      </Marker>)
    this.setState({allPins: allPins});
    let count = this.state.pinCtr + 1;
    this.setState({pinCtr: count});
    
    console.log('is this the obj?', this.state.allPins);

    var newPin = this.state.allPins[this.state.allPins.length-1];
    var row = {
      type: newPin.props.issue,
      reporter: newPin.props.name,
      location: {
        lat: newPin.props.position.lat,
        lng: newPin.props.position.lng        
      }
    }
    console.log('this is the row ', row)
    axios.post('/issue', row);
  }

  render () {
    const mapContainer = <div style={{height:'100%', width:'100%'}}></div>

    const markers = this.props.markers.map((pin, i) => {
      const marker = {
        position: {
          lat: parseFloat(pin.location.lat),
          lng: parseFloat(pin.location.lng)
        }
      }
      return <Marker key={i} {...marker} onClick={this.onMarkerClick}>
        <InfoWindow onCloseClick={this.closeInfo} content={''+'Issue: '+pin.type+'\n'+'ReporterID: '+pin.user_id}/>
      </Marker>
    })
    return (
      <GoogleMapLoader
        containerElement = { mapContainer }
        googleMapElement = {
          <GoogleMap
            onClick={this.dropPin}
            defaultZoom={this.props.zoom}
            defaultCenter={this.props.center}
            options={{streetViewControl:false, mapTypeControl:false}}>
            { markers }
            {this.state.allPins}
          </GoogleMap>
        }/>
    )
  }
}
export default Map
