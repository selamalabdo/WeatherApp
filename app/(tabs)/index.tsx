import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, FlatList, Image, ImageBackground } from 'react-native';

const API_KEY = '854dd88df3eb5145c55b21c87a1ce02d';

interface WeatherItem {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string; icon: string; main: string }[];
}

interface WeatherResponse {
  city: { name: string; country: string };
  list: WeatherItem[];
}


const backgrounds: { [key: string]: any } = {
  clear: { uri: 'https://png.pngtree.com/thumb_back/fh260/background/20220601/pngtree-clearskied-summer-landscape-in-the-field-grass-countryside-weather-photo-image_36295958.jpg' },
  rain: { uri: 'https://e1.pxfuel.com/desktop-wallpaper/947/124/desktop-wallpaper-rainy-window-backgrounds.jpg' },
  snow: { uri: 'https://media.istockphoto.com/id/1066902512/tr/foto%C4%9Fraf/k%C4%B1%C5%9F-arka-plan.jpg?s=170667a&w=0&k=20&c=FIei-1pirUfv-4Qrlu7gko0ZPVmAdXo4CKHCcYTubOo=' },
  default: { uri: 'https://play-lh.googleusercontent.com/pXn5gZYTebtoEeQDkGh8Qz88EclFnZ9v_cGasmKvsvRBU8CKnkvFv26yaF1vbK066Q' }
};

export default function App() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getBackgroundImage = () => {
    if(!weather || !weather.list[0]) return backgrounds.default;
    const main = weather.list[0].weather[0].main.toLowerCase();
    if(main.includes('clear')) return backgrounds.clear;
    if(main.includes('rain') || main.includes('drizzle')) return backgrounds.rain;
    if(main.includes('snow')) return backgrounds.snow;
    return backgrounds.default;
  };

  const fetchWeather = async () => {
    if(!city) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=5`
      );
      const data: WeatherResponse = await response.json();
      setWeather(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}: {item: WeatherItem}) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.dt_txt}</Text>
      <Image
        style={styles.icon}
        source={{uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}}
      />
      <Text style={styles.temp}>{item.main.temp}°C</Text>
      <Text style={styles.desc}>{item.weather[0].description}</Text>
    </View>
  );

  return (
    <ImageBackground source={getBackgroundImage()} style={styles.container}>
      <Text style={styles.title}>Hava Durumu</Text>
      <TextInput
        style={styles.input}
        placeholder="Şehir girin"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Getir" onPress={fetchWeather} color="#a6c5d6ff" />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop:10}} />}
      
      {weather && weather.list ? (
        <FlatList
          data={weather.list}
          keyExtractor={(item) => item.dt_txt}
          renderItem={renderItem}
          style={{marginTop:20, width:'100%'}}
        />
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'flex-start', alignItems:'center', padding:20 },
  title: { fontSize:30, marginBottom:20, color:'#fff', fontWeight:'bold', textShadowColor:'#000', textShadowOffset:{width:1,height:1}, textShadowRadius:5 },
  input: { borderWidth:1, borderColor:'#fff', padding:10, width:'100%', borderRadius:8, marginBottom:10, backgroundColor:'#ffffff80', color:'#000' },
  item: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:10, backgroundColor:'#ffffff80', borderRadius:10, marginBottom:10 },
  date: { flex:2, color:'#000' },
  icon: { width:50, height:50 },
  temp: { flex:1, fontWeight:'bold', fontSize:16, color:'#000' },
  desc: { flex:2, fontStyle:'italic', color:'#000' }
});


