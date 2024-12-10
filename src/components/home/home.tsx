import { useEffect, useState } from "react"
import { ReactSession } from 'react-client-session';
import TextField from '@mui/material/TextField';
import bcrypt from "bcryptjs";
import PlaceIcon from '@mui/icons-material/Place';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import sun from './static/sun.png'
import rainy from './static/rainy.png'
import cloudy from './static/cloudy.png'
import './home.css'
function Home(){
    const [render, setRender] = useState(false)
    const [city, setCity] = useState('')
    const [forcastData, setForecastData]= useState();
    const [renderForecast, setRenderForecast] = useState(false);
    const [searching, setSearching] = useState(false)
    const navigate = useNavigate();
    //check when the page is opened if there is a session with the wright data created.
    useEffect(()=>{
        const code = ReactSession.get('passcode');
        if(code===undefined){
            navigate('/', {replace:true})
        }else{
            if(bcrypt.compare(import.meta.env.VITE_SECRET_CODE, code)){
                setRender(true)
            }else{
                navigate('/', {replace:true})
            }
        }
    })
    async function handleCityLocation(){
        setSearching(false)
        setRenderForecast(false)
        setForecastData(undefined)
        if(city!=''){
            if(city==='Blagoevgrad'){
                try {
                    setSearching(true)
                    const response = await fetch(import.meta.env.VITE_KEY_BLAGO);
                    if (!response.ok) {
                      throw new Error("Failed to fetch forecast data");
                    }
                    const data = await response.json();
                    setRenderForecast(true)
                    setForecastData(data);
                  } catch (err) {
                    console.log(err);
                  }
            }else if(city==='Tirana'){
                try {
                    setSearching(true)
                    const response = await fetch(import.meta.env.VITE_KEY_TIRANA);
                    if (!response.ok) {
                      throw new Error("Failed to fetch forecast data");
                    }
                    const data = await response.json();
                    setRenderForecast(true)
                    setForecastData(data);
                    console.log(data)
                  } catch (err) {
                    console.log(err);
                  }
            }else{
                console.log('This data is not available yet!')
            }
        }
    }
    function getImage(rain){
        if(rain>5){
            return rainy
        }else if(rain<5 && rain > 1){
            return cloudy
        }else{
            return sun
        }
    }
    return(
        <>
         {render===false? '': 
            <>
            <div className="homePage">
                <h1>Weather forecasting</h1>
                <div className="serachingMenu">
                    <div className="seraching">
                    <TextField
                    label=""
                    variant="outlined"
                    placeholder="Enter a location..."
                    onChange={(e)=>{setCity(e.target.value)}}
                    required
                    />
                    <button onClick={handleCityLocation} type='submit' className="navigation"><PlaceIcon/></button>
                    </div>
                </div>
                <div className="forecast">
                    <>
                        {searching===false? "":
                            <>
                                {renderForecast===false?<div className='loadingScreen'>
                                            <CircularProgress size="10rem" />
                                        </div>:
                                    <>
                                        {forcastData===undefined? "": <>
                                            {
                                                forcastData.map((forecast, index)=>(
                                                    <>
                                                    <div className="forecastBox" key={index}>
                                                        <div className="iconDiv">   
                                                            <img className='icon' src={getImage(Math.round(forecast.rain_sum))} alt="" />
                                                        </div>
                                                        <div className="predictionInfo">
                                                            <h3>Weather Data</h3>   
                                                            <p>Date: {forecast.date} </p>
                                                            <p>Max Temperature: {Math.round(forecast.temp_max)}</p>
                                                            <p>Min Temperature: {Math.round(forecast.temp_min)}</p>
                                                            <p>Rain: {(forecast.rain_sum).toFixed(2)} mm</p>
                                                            <h3>Clothing Items</h3>
                                                            <p>Upper Body: {forecast.upper_body} </p>
                                                            <p>Lower Body: {forecast.lower_body} </p>
                                                            <p>Footware: {forecast.shoes} </p>
                                                        </div>
                                                    </div>
                                                    </>
                                                ))
                                            }
                                        </>}
                                    </>
                    }
                            </>
                        }
                    </>
                </div>
            </div>
            </>
         }
        </>
    )
}
export default Home