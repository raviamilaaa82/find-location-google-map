import logo from './logo.svg';
import './App.css';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer,useLoadScript } from '@react-google-maps/api';
import { Input, Button, Box, ButtonGroup, Flex, HStack, Icon, IconButton,Text } from '@chakra-ui/react';
// import { FaTimes } from '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTimes,faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';


const center = { lat: 6.9337, lng: 79.8500 }
function App() {
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState('');
  const originRef = useRef();
  const destinationRef = useRef();
  const [map,setMap]=useState(/**@type google.maps.Map */(null));
  const google = window.google
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
   
  })
  if (!isLoaded) {
    return <p>Loading..</p>
  }
  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return
    }
    const directionService = new google.maps.DirectionsService();
    const result = await directionService.route(
      {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING
      }
    )
    setDirectionResponse(result)
    setDistance(result.routes[0].legs[0].distance.text)
    setDuration(result.routes[0].legs[0].duration.text)
  }
  function clearRoute() {
    setDirectionResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ""
    destinationRef.current.value = ""
  }
  // const searchNearbyPlace=(e)=>{
  //   // console.log(e);
  //   console.log("log");

  // }
  return (


    <div className="App">
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        bgPos="center"
        bgSize="cover"
        h='100vh'
        w='100vw'
      >
        <Box position="absolute" left={0} top={0} h='100%' w='100%'>
          <GoogleMap center={center} 
          zoom={15} 
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={map=>setMap(map)}>
            <Marker position={center} />
            {directionResponse && <DirectionsRenderer directions={directionResponse} />}
          </GoogleMap>
        </Box>
       
        <Box p={8}
          borderRadius='lg'
          m={6}
          bgColor="white"
          shadow='base'
          // minW="container.md"
          zIndex='4'>
       
      
      <HStack spacing={4}>
        <Autocomplete style={{width:"400"}}>
          <Input type="text" placeholder='origin' ref={originRef} style={{width:"400px"}}/>
        </Autocomplete>
        <Autocomplete>
          <Input type="text" placeholder="Destination" ref={destinationRef} />
        </Autocomplete>

        <ButtonGroup>
          <Button type="submit" style={{backgroundColor:'pink'}} onClick={calculateRoute} >
            Calculate Route
          </Button>
          <IconButton
            aria-label='center back'
            icon={<FontAwesomeIcon icon={faTimes} />}
            onClick={clearRoute}>

          </IconButton>
        </ButtonGroup>

      </HStack>
      <HStack spacing={4} justifyContent='space-between'>
        <Text>Distance:{distance}</Text>
        <Text>Duration:{duration}</Text>
        <IconButton
        aria-label='center back'
        icon={<FontAwesomeIcon icon={faLocationArrow} />}
        isRound='true'
        onClick={()=>map.panTo(center)}/>
      </HStack>
      </Box>
      </Flex>
    </div>
  );
}

export default App;
