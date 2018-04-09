import React, { Component } from 'react';
import moment from 'moment';

import './css/weatherView.css';
import clearSky from './image/white-circle.png';
import clearLight from './image/yellow-line.svg';
import cloudySky from './image/cloudy.png';
import lightning from './image/lightning.svg';

import lightRain from './image/light-cloud.svg';
import heavyRain from './image/rainy.svg';
import miniCloud from './image/mini-cloud.png';
import miniSun from './image/mini-sun.png';
import miniRain from './image/mini-rain.png';
import miniSnow from './image/mini-snow.png';
import miniMachine from './image/mini-machine.png';
import FadeIn from 'react-fade-in';

// this is for local test.
// you should change this to your API server
import getApiUrl from './localtest/getUrl';
const welcomeText = [
    (
        <div>
        어디서 무얼 하든 기분 좋은 날씨입니다 <br/>
        오늘도 행복한 하루가 되시길
        </div>
    ), 
    (
        <div>
            흐리고 비가 오는 날씨입니다 <br />
            다시 맑아 질테니 걱정 마세요 :)
        </div>
    )
];


// 글씨를 통해 간단하게 요약 해주는 부분
// 디자인에서 "어디서 무얼 하든 기분 좋은 날씨입니다" 부분
// 날짜 포맷은 'YYYY년 M월 D일' 로 받는다.
// moment().format('D MMM. YYYY dddd')로 영문 변환한다.
moment.locale('ko', {
    weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일_일요일'.split('_'),
});

class WeatherHeader extends Component {
    constructor(props) {
        super(props);
        this.date = moment(props.date, 'YYYY년 M월 D일').locale('ko').format('YYYY년 M월 D일 dddd');
    }
    render() {
        var enDate = moment(this.date, 'YYYY년 M월 D일').locale('en').format('D MMM. YYYY dddd');
        return (
            <div id='weatherHeader'>
                <div id='weatherTitle' className='martelFont'>
                    Weather
                </div>
                <div className="greyFont dateFont">
                    {enDate} / {this.date} 
                </div>
                <div className="welcome">
                    {welcomeText[0]}
                </div>
            </div>
        );
    }
}

var weatherTitleKo = {
    'Temperature': '날짜별 날씨',
    'Fine dust': '미세먼지 농도',
    'Sky': '하늘 날씨',
};
var weatherImage = {
    'Temperature': miniMachine,
    'Sky': miniRain,
}
class OnedayWeather extends Component {
    render() {
        var weather = this.props.weather;
      return (
        <div className='oneday root'>

            <div className='oneday title black strong font16px inline'>
                {this.props.day}
            </div>
                         
            <div className='oneday img'>
                <img alt='날씨 이미지' src={this.props.img} />
            </div>

            <div className='oneday text'>
                {this.props.weather}
            </div>
        </div>
      )
    };
}

var weeklyReport = [
    'Today',
    'D + 1',
    'D + 2',
    'D + 3',
    'D + 4',
    'D + 5',
]
class WeatherDetail extends Component {    
    getDailyWeather() {
        var weeklyWeather = weeklyReport.map((value, index, array) => {
            var template = [];
            if (index !== 0) {
                template.push((
                    <div className='inline dividor' key={'dividor' + index}></div>
                ))
            }
            var weather = this.props.weather[index];
            var weatherText = '';
            if (this.props.img == miniMachine) {
                weatherText += weather.c_low;
                weatherText += "º / "
                weatherText += weather.c_high;
                weatherText += "º"
            } else {
                weatherText = weather.sky;
            }
            
            template.push((
                    <OnedayWeather weather={weatherText} day={value} key={value} img={this.props.img}></OnedayWeather>
                ));
            return template;
        })
        return weeklyWeather;
    }

    render() {
      return (
        <div  className='weatherDetail'>
            {this.getDailyWeather()}
        </div>
      )
    };
}
// 날짜별 온도 요약/미세먼지 요약을 보여주는데 사용되는 컨테이너
class WeatherBox extends Component {
    render( ) {
        return (
            <div className='weatherBox'>
                <div className='black strong font20px martelFont'>
                    {this.props.title}
                </div>
                <div className='grey strong font16px spoqaHanSans'>
                    {weatherTitleKo[this.props.title]}
                </div>
                <WeatherDetail weather={this.props.weather.forecast} img={weatherImage[this.props.title]}></WeatherDetail>
            </div>
        )
    }
}

class CurrentDetail extends Component {   
    validateWeather(weather) {
        if (weather.humidity == ''|| weather.humidity == null) {
            weather.humidity = 0;
        }
        if (String(weather.rain).indexOf('눈') >= 0) {
            weather.rain = '눈';
        }
        var sky = String(weather.sky).split(' ');
        weather.sky = sky[sky.length - 1];
    } 
    render() {
        var weather = this.props.weather;
        this.validateWeather(weather);
        return (
            <div id='currentDetail'>
                <div className='tempDiv'>
                    <div className='currentTemp'>
                        {parseInt(weather.c_current)}
                        <span className='celsius'>º</span>
                    </div>
                    <div className='tempSummary'>
                    💧 {weather.humidity} %<br />
                        {parseInt(weather.c_low)} / {parseInt(weather.c_high)}
                    </div>
                </div>
                <div id='horizontalLine'></div>
                <div className='currentCloud'>
                    <img className='cloudImage' alt='cloud or not' src={clearSky} />
                    <div className='cloudText'>
                        {weather.sky} <br />
                        {weather.rain}
                    </div>
                </div>
            </div>
        )
    };
}
// 현재 날씨를 표현하는 뷰 
// 디자인에서 온도 등등과 이미지 크게 표시하는 부분
class CurrentWeather extends Component {
    render() {
        var weather = this.props.weather;
      return (
        <div id='currentWeather'>
            <CurrentDetail weather={weather}></CurrentDetail>
            <img className='lightning' alt='no lightning' src={clearLight} />
            <img className='cloud' alt="clear sky" src={clearSky} />
        </div>
      )
    };
}

class MainView extends Component {
    render() {
      return (
        <FadeIn>
        <div className='mainView'>
            <WeatherHeader date={moment().format('YYYY년 M월 D일')}></WeatherHeader>
            <CurrentWeather weather={this.props.weather}></CurrentWeather>
            {this.props.enableWeekly? 
            <div onClick={this.props.onClick} className='clickable font16px center' style={{marginTop: '-90px', opacity: '0.8', color:'white'}}>
                주간 날씨 자세히 보기
            </div>:<div></div>
            }
        </div>
        </FadeIn>
      )
    };
}
class WeeklyView extends Component {
    render() {
      return (
        <FadeIn>
        <div className='mainView'>
            <div onClick={this.props.onClick} className='clickable font16px center' style={{ opacity: '0.8', color:'white'}}>
                오늘 날씨 자세히 보기
            </div>
            <WeatherBox title='Temperature' weather={this.props.weather}></WeatherBox>
            {/* <WeatherBox title='Fine dust' weather={this.props.weather}></WeatherBox> */}
            <WeatherBox title='Sky' weather={this.props.weather}></WeatherBox>
        </div>
        </FadeIn>
      )
    };
}
// 날씨 표시하는 전체 컨테이너
class WeatherViewRoot extends Component {
    constructor(props) {
        super(props);
        this.showMain = this.showMain.bind(this);
        this.showWeekly = this.showWeekly.bind(this);
        this.state = { 
            showMain: true,
            currentWeather: {
                c_current: 17,
                c_high: 19,
                c_low: 8,
                sky: "맑음",
                wind: 14,
                rain: "비옴",
                humidity: 14
            },
            forecastWeather: {},
            enableWeekly: false
        };
    }

    componentWillMount() {
        var lat = this.props.lat;
        var lon = this.props.lon;
        fetch(getApiUrl(0, lat, lon)).then(results => {
            return results.json();
        }).then(data => {
            this.setState({
                currentWeather: data,
            });
        })
        fetch(getApiUrl(2, lat, lon)).then(results => {
            return results.json();
        }).then(data => {
            this.setState({
                forecastWeather: data,
                enableWeekly: true
            });
        })
    }

    showMain() {
        this.setState({showMain: true});
    }
    showWeekly() {
        this.setState({showMain: false});
    }
    render() {
        return (
        <div id='weatherRoot'>
            {
                this.state.showMain? 
                <MainView onClick={this.showWeekly} weather={this.state.currentWeather} enableWeekly={this.state.enableWeekly}></MainView>: 
                <WeeklyView onClick={this.showMain} weather={this.state.forecastWeather}></WeeklyView>
            }
        </div>
        );
    }
}

export {
    WeatherViewRoot as default, 
    WeatherHeader
};
