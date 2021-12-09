import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $("#logout").on("click",() => {
        
      location.href = 'login'
      
    });
    // reproducir audio
    let audio = document.createElement('audio');
    audio.src = 'assets/audio/login.mp3'
    audio.play()
    audio.volume = 0.02;

  }



}
