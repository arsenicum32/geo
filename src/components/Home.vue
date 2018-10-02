<template>
  <div>
    <div v-if="setq" class="alert">загрузка...</div>
    <div v-if="!socket" class="alarm">соединение с сервером прервано</div>
    <div class="menu">
      <div>
        <input :value="state" @input="yo( $event.target.value , 'state' )" placeholder="штат"/>
        <br/>
        <input :value="zip" @input="yo( $event.target.value , 'zip' )" placeholder="ZIP код"/>
      </div>
      <div>
        <input :value="sity" @input="yo( $event.target.value , 'sity' )" placeholder="город"/>
        <br/>
        <input :value="name" @input="yo( $event.target.value , 'name' )" placeholder="имя фамилия"/>
      </div>
      <input v-model="displaym" type="checkbox" />маркеры
      <button @click="center = [36.778259, -119.417931]; zoom = 4" >показать карту страны</button>

    </div>
    <l-map ref="map"
     :zoom="zoom"
     :center="center"
     :maxZoom="16"
     :minZoom="3"
     style="height:400px;">
     <l-tile-layer :url="url"
       :attribution="attribution"></l-tile-layer>
     <l-marker v-for="(marker,m) in result" :key="m" :lat-lng="[marker.lat , marker.log ]" :icon="icon" @click="test(marker)" @l-add="add" >
       <l-popup :content="marker.reg + ' ' + marker.zip + '<br/>' + marker.name.split('-').join(' ')"></l-popup>
     </l-marker>
    </l-map>
    <div v-if="total>=0">
      <div v-if="total>0">{{ total }} результатов по вашему запросу</div>
      <div v-if="total == 0">ничего не найдено :(</div>
      <div v-if="total>500">
        <span>показано {{page}}-{{page+500}} из {{total}} результатов</span>
        <a href="#" v-if="total > page" @click="nesta">далее</a>
      </div>
    </div>
  </div>
</template>

<script>

import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import io from 'socket.io-client'
const socket = io("http://socket.plakot.ru");

import icon from '../assets/popup.png'

export default {
  name: 'Home',
  components: { LMap, LTileLayer, LMarker, LPopup },
  data() {
    return {
      name: "",
      state: "",
      zip: "",
      sity:"",
      zoom:13,
      socket: null,
      result: [],
      total: null,
      page: 0,
      displaym: true,
      setq: false,
      center: [47.413220, -1.219482],
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: [],
      icon: L.icon({
          iconUrl: icon,
          //shadowUrl: 'http://placehold.it/50x64',

          iconSize:     [20, 40], // size of the icon
          // shadowSize:   [50, 64], // size of the shadow
          // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          // shadowAnchor: [4, 62],  // the same for the shadow
          // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      })
    }
  },
  mounted(){

    socket.on('connect', e => this.socket = socket );
    socket.on('disconnect', e => this.socket = null );
    socket.on('result', data => {
      console.log(data);
      this.result = data
      if(data.length)
      this.center = [data[0].lat , data[0].log ]
    });

    socket.on('result_total', data => {
      this.setq = false;
      this.total = data[0]["count(*)"];
    });
  },
  methods: {

    nesta(){
      const { zip , name , state , sity , page } = this;
      this.page+=500;
      if(this.socket && this.displaym){
        this.setq = true;
        this.socket.emit("grab", { zip , name , state , sity , page } );
      }
    },
    add(e){
      // $event.target.openPopup()
      e.target.openPopup()
    },
    test(e){
      console.log(e);
    },
    yo(v , t ){
      this[t] = v;
      const { zip , name , state , sity } = this;
      if(this.socket && this.displaym){
        this.setq = true;
        this.socket.emit("grab", { zip , name , state , sity } )
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import 'leaflet/dist/leaflet.css';

.menu{
  display: flex;
  height: 120px;
}
input{
  padding: 12px;
  border: none;
  font-size: 1.2em;
  outline: none;
  background: #eee;
  border-radius: 12px;
  margin-bottom: 6px;
}
button{
  padding: 12px;
  border: none;
  font-size: 1.2em;
  height: 50px;
  outline: none;
  background: #333;
  color: #eee;
  border-radius: 12px;
  cursor: pointer;
}
.alert{
  position: fixed;
  top: 30vh;
  width: 100%;
  text-align: center;
  /* left: calc(50% - 60px); */
  font-size: 3em;
  z-index:1000;
}
.alarm{
  position: fixed;
  top: 30vh;
  width: 100%;
  text-align: center;
  background: red;
  color: white;
  /* left: calc(50% - 60px); */
  font-size: 3em;
  z-index:10000;
}
</style>
