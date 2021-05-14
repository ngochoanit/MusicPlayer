const $= document.querySelector.bind(document);
const $$= document.querySelectorAll.bind(document);

const header=  $('.header h2');
const cdthumb= $('.cd-thumb');
const audio= $('#audio');
const cd= $('.cd');
const playBtn=$('.btn.btn-toggle-play');
const player=$('.player');
const progress=$('#progress');
const nextBtn=$('.btn.btn-next');
const playList=$('.playlist');
const prevBtn=$('.btn.btn-prev');
const randomBtn=$('.btn.btn-random');
const repeatBtn=$('.btn.btn-repeat');
const playerList=$('.playlist');

const app= {
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    songs: [
        {
          name: "3 Đi (Đi. Đi. Đi)",
          singer: "K-ICM, T-ICM, Kelsey, V.A",
          path: "./asset/song/3 Đi (Đi. Đi. Đi) - K-ICM, T-ICM, Kelsey, V.A.mp3",
          image: "./asset/img/thumbnail/thumb1.jpg"
        },
        {
          name: "Dilemma ",
          singer: "Nelly, Kelly Rowland",
          path: "./asset/song/Dilemma - Nelly, Kelly Rowland.mp3",
          image:"./asset/img/thumbnail/thumb2.jpg"
        },
        {
          name: "Move Your Body",
          singer: "Sia, Alan Walker",
          path:"./asset/song/Move Your Body-Sia, Alan Walker.mp3",
          image:"./asset/img/thumbnail/thumb3.jpg"
        },
        {
          name: "Unstoppable",
          singer: "Sia",
          path: "./asset/song/Unstoppable - Sia.mp3",
          image:"./asset/img/thumbnail/thumb4.jpg"
        },
        {
          name: "Whistle Remix",
          singer: "HEST X CHENYI",
          path: "./asset/song/Whistle (HEST X CHENYI Remix).mp3",
          image:"./asset/img/thumbnail/thumb5.jpg"
        },
        {
          name: "With You (Ngẫu Hứng)",
          singer: "Nick Strand, Hoaprox, MIO",
          path:"./asset/song/With You (Ngẫu Hứng).mp3",
            image:"./asset/img/thumbnail/thumb6.jpg"
        },
        {
          name: "Yeu5",
          singer: "Rhymastic",
          path: "./asset/song/Yeu5-Rhymastic.mp3",
          image:"./asset/img/thumbnail/thumb7.jpg"
        },
        {
            name: "Fade",
            singer: "Alan Walker",
            path:"./asset/song/Fade - Alan Walker.mp3",
              image:"./asset/img/thumbnail/thumb8.jpg"
          },
          {
            name: "In The End (Mellen Gi Remix)",
            singer: "Tommee Profitt, Fleurie",
            path: "./asset/song/In The End (Mellen Gi Remix) - Tommee Profitt, Fleurie.mp3",
            image:"./asset/img/thumbnail/thumb9.jpg"
          }
    ],

    render: function(){
        const html = this.songs.map((song,index) =>{
            return `<div class="song-item song-item-${index}" data-index="${index}">
            <div class="song-item__thumb" style=" background-image: url(${song.image})">
            </div>
            <div class="song-item__body">
                <h3 class="song-item__body-title">${song.name}</h3>
                <p class="song-item__body-author">${song.singer}</p>
            </div>
            <div class="song-item__options">
                <i class="song-item__option-icon ti-more-alt"></i>
            </div>
        </div>`
        });
        playList.innerHTML= html.join('\n');
        playList.style.paddingTop= $('.dashboard').offsetHeight + 'px';
        $('.song-item').classList.add('active');
    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    // Lắng nghe và xử lý sự kiện
    hendleEvents: function(){
        const _this=this;
        const cdWidth= cd.offsetWidth;
        const cdthumbAnimate= cdthumb.animate(
            [
                {
                    transform: 'rotate(360deg)'
                },
            ],
            {
                // timing options
                duration: 10000,
                iterations: Infinity
            });
        cdthumbAnimate.pause();    

        const updateProgress= function(){
            if(audio.duration){
                const progressPercent= Math.floor(audio.currentTime / audio.duration *100);
                progress.value= progressPercent;
            }
        };

        const activeSongItem=function(){
            const songItemActive= playList.querySelector('.song-item.active');
            songItemActive.classList.remove('active');
            newSongItemActive= playList.querySelector(`.song-item.song-item-${_this.currentIndex}`);
            newSongItemActive.classList.add('active');
            setTimeout(function(){
                newSongItemActive.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            },1000)
            
           
        }
        // xử lý phóng to thu nhỏ cd
        document.onscroll= function(){
            const scrollTop=   window.scrollY || document.documentElement.scrollTop;
            const newCdWidth= cdWidth- scrollTop;
            cd.style.width= newCdWidth > 0 ? newCdWidth + 'px' : 0;
            // cd.style.opacity= newCdWidth/cdWidth;
        };
        // xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            };
        };

        // khi song dược play
        audio.onplay= function(){
            _this.isPlaying= true;
            player.classList.add('playing');
            cdthumbAnimate.play();
           
        }

        // khi song bị pause
        audio.onpause=function(){
            _this.isPlaying= false;
            player.classList.remove('playing');
            cdthumbAnimate.pause();
           
        };

        // khi song dang playing
        audio.addEventListener('timeupdate',updateProgress);
        
        //xử lý tua
        progress.oninput=function(){
            console.log(123)
            audio.removeEventListener('timeupdate',updateProgress)
        }
        progress.onchange= function(){
            // audio.removeEventListener('timeupdate',updateTime)
            const progressPercent= progress.value;
            audio.currentTime=Math.floor (progressPercent/100*audio.duration);
            audio.addEventListener('timeupdate',updateProgress);
        };

        // xử lý next
        nextBtn.onclick=function(e){
            _this.nextSong();
            audio.play();
            activeSongItem();
        }

        // xử lý prev
        prevBtn.onclick=function(e){
            _this.prevSong();
            audio.play();
            activeSongItem();
        }

        // xử lý active activeRandom
        randomBtn.onclick= function(){
            _this.isRandom= !_this.isRandom;
            randomBtn.classList.toggle('active',_this.isRandom);
        }

        // xử lý active repeat
        repeatBtn.onclick= function(){
            _this.isRepeat= !_this.isRepeat;
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        // xử lý khi chạy hết bài
        audio.onended=function(){
            if(_this.isRepeat)
            {
                audio.play();
            }
            else
            {
                _this.nextSong();
                audio.play();
                activeSongItem();
            }
        }
        
        //xử lý click item song
        playList.onclick=function(e){
            const songNode=e.target.closest('.song-item:not(.active)');
            if(songNode|| e.target.closest('.song-item__options'))
            {
                if(songNode){
                    _this.currentIndex= songNode.dataset.index-1;
                    console.log()
                    nextBtn.click();
                }

                if(e.target.closest('.song-item__options')){

                }
            }
        }
    },
    loadCurrentSong:function(){
        header.textContent= this.currentSong.name + ' - ' + this.currentSong.singer;
        cdthumb.style.backgroundImage= `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    nextSong:function(){
        if(this.isRandom){
            this.currentIndex= this.activeRandom();
            console.log(this.currentIndex)
        }
        else{
            this.currentIndex++;
            if(this.currentIndex > this.songs.length-1)
                {
                this.currentIndex=0;
            }
        }
        this.loadCurrentSong();
    },  
    activeRandom:function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length );
        }while(newIndex===this.currentIndex)
        return newIndex;
    },
    
    prevSong:function(){
        if(this.isRandom){
            this.currentIndex= this.activeRandom();
            console.log(this.currentIndex)
        }
        else{
            this.currentIndex--;
            if(this.currentIndex <  0)
            {
                this.currentIndex=this.songs.length-1;
            }
        }
        this.loadCurrentSong();
    },    
    start:function(){
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
        this.hendleEvents();

    }
    
};
app.start();