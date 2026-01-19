let isSerie = document.getElementById('serie');
let isMovie = document.getElementById('movie');

let types = document.querySelectorAll('input[type=radio][name=type]');

types.forEach(type => {
    type.addEventListener('change', () =>{
        if (type.value == "movie") {
            document.getElementById('season-selector').style.display = "none";
        } else if (type.value == "serie"){
            document.getElementById('season-selector').style.display = "block";
        }
    })
})


function convertMinutes(minutess){
    let hours = Math.floor(minutess / 60) ,
    minutes = Math.floor(minutess % 60),
    total = '';

    if (minutess < 60){
        total = `${minutes}m`
        return total
    } else if (minutess > 60){
      total = `${hours}h ${minutes}m`
      return total
    } else if (minutess = 60){
        total = `${hours}h`
        return total
    }
}


function generar() {
    let serieKey = document.getElementById('numero').value;
    let languaje = "es-MX"
    let seasonNumber = document.getElementById('numeroTemporada').value;

    const cargarPeliculas = async() => {

        if (isSerie.checked) {
            try {

                const respuesta = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}?api_key=c71d55c790adcb0fa9ea6ebcbc9a61a7&language=${languaje}`);
                const respuesta3 = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}/season/${seasonNumber}?api_key=c71d55c790adcb0fa9ea6ebcbc9a61a7&language=${languaje}`);
    
                if (respuesta.status === 200) {
                    const datos = await respuesta.json();
                    const datosTemporada = await respuesta3.json();
                    console.log(datos)
                    let tags = '';
    
                    datos.genres.forEach((genre, index) => {
                        if (index > 2) {
                            return
                        }
                        tags += `${genre.name},     `          

                    });

                       
                    let episodeList = '';
    
                    datosTemporada.episodes.forEach(episode => {
                        let runtime ;
                        if (episode.runtime != null) {
                            runtime = convertMinutes(episode.runtime);
                        } else {
                            runtime = ''
                        }
                        episodeList += `
                        <li>
                        <a href="#!" class="episode" 
                        option-1-lang="Sub"
                        option-1-server="SB"
                        option-1-url=""
                        >
                        <div class="episode__img">
                        <img src="https://image.tmdb.org/t/p/w300${episode.still_path}" onerror="this.style='display:none';">
                        <div class="episode__no-image"><i class="fa-regular fa-circle-play"></i></div>
                        </div>
                        <div class="epsiode__info">
                        <h4 class="episode__info__title">${episode.episode_number} - ${episode.name}</h4>
                        <div class="episode__info__duration">${runtime}</div>
                        </div>
                        </a>
                        </li>
                        `
                    })
    
                    let seasonsOption = '';
    
                    datos.seasons.forEach(season => {
                        
                        if(season.name != "Especiales"){
                            seasonsOption += `<option value="${season.season_number}">Temporada ${season.season_number}</option>
                            `
                        }
                    })
    
                    let genSeasonsCount;
    
                    if (datos.number_of_seasons == 1){
                        genSeasonsCount = " Temporada"
                    } else if (datos.number_of_seasons > 1){
                        genSeasonsCount = " Temporadas"
                    }
                    
                    let template = document.getElementById('html-final');
    
                    let justHtml = ` [stt/Serie]
[hd/HD]
[sc/${datos.vote_average.toFixed(1)}]

<!-- 
TITULO DE LA ENTRADA:     ${datos.name} - ${datos.first_air_date.slice(0,4)}
ETIQUETAS DE LA ENTRADA:   ${tags} Series
IMAGEN DE FONDO:    https://image.tmdb.org/t/p/original${datos.backdrop_path}
-->

<span><!--more--></span>
<div class="infor row">
<div class="entrada">
<div class="poster">
<img src="https://image.tmdb.org/t/p/w300/${datos.poster_path}"/>
</div>
<div class="detall">
<h1 class="bs-title">${datos.name}</h1>
<ul class="Eti"><li class="pel">Serie</li><li>${datos.number_of_seasons + genSeasonsCount}</li><li>${datos.first_air_date.slice(0,4)}</li></ul>
<ul class="genero">
${tags}
</ul>
<ul class="califica">
<div class='porcentajes' style="--porcentaje: ${(datos.vote_average.toFixed())}${(datos.vote_average.toFixed(1) / 2).toFixed(1)}; --color: forestgreen"><svg width="43" height="43">
<circle r="19" cx="50%" cy="50%" pathlength="100" />
<circle r="19" cx="50%" cy="50%" pathlength="100" /></svg>
<span>${(datos.vote_average.toFixed())}${(datos.vote_average.toFixed(1) / 2).toFixed(1)}%</span>
  </div>
<li class="strella"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i></li><li><span>(${datos.vote_count})</span>
</ul>
<p class="sinopsis">${datos.overview}</p>
</div>
</div>
<!--more-->
<ul class="botones">
<li><a href="https://www.youtube.com/watch?v=Mj4_xG5NXeo" target="black"><i class="fa fa-youtube-play"></i><p> Ver Trailer</p></a></li>
  <li><a href="#!" class="btn-play"><i class="fa fa-play"></i><p> Reproducir</p></a></li>
<li><a class="x-linkPlus x-link2" id="dwnld-btn"><i class="fa fa-download"></i><p> Descargar</p></a></li>
</ul>
</div>

<div class="max-width season-list" id="allEpList">
<div class="select-season">
<h2>Episodios</h2>
<select name="" id="select-season">
${seasonsOption}
</select>
</div>

<div id="temps">
<ul class="caps-grid animation" id="season-1">
${episodeList}

</ul><!--Siguiente temporada debajo-->

  
</div>
</div>

<div class="the-best-player">
<div class="max-width-header">
<div class="header-title-info">
<h1 class="header-title-info_tit">${datos.name}</h1>
<p class="header-title-info_sub"></p>
</div>
</div>

<div class="options_grid" id="optionsGrid"></div>
<div class="player-bg" style="background: url('https://image.tmdb.org/t/p/w1280/${datos.backdrop_path}') no-repeat center center / cover;"></div>
<div class="iframe-container">
<iframe frameborder="0" src="" scrolling="no" allowfullscreen></iframe>
</div>
<div class="header-actions">
<div class="prev-episode"><i class="fa fa-arrow-left"></i><p>Anterior</p></div>
<a href="#allEpList" class="back-episode-list"><i class="fa fa-list-ul"></i><p>Episodios</p></a>
<div class="next-episode"><p>Siguente</p><i class="fa fa-arrow-right"></i></div>
</div>
</div>


<!-- TABLA DE DESCARGAS  /-->
<div class="download" id="todownload"><div class="contenedors"><div class="opciones-descarga">
<div class="titulo"> <i class="fa fa-download"><span> Descargas</span></i> <a>X</a></div>

<table>
<thead>
<tr>
<th scope="col">#</th><th>SERVIDOR</th><th>IDIOMA</th><th>DESCARGAR</th>
</tr>
</thead>
<tbody><tr><th>0</th><td>Mega</td><td>Subtitulado</td><td>
<a href="#" target="_blank" class="link"><span> Descargar</span></a>
</td></tr></tbody>
<tbody><tr><th>0</th><td>Mega</td><td>Subtitulado</td><td>
<a href="#" target="_blank" class="link"><span> Descargar</span></a>
</td></tr></tbody>
<!-- AGREGAR MAS  /-->
</table>

</div></div></div>

<!-- Copyrigt @plantillasplus.com - TMDB Movies -->
                    `;
                    
                    let seasonOnly = `
                    <ul class="caps-grid hide" id="season-${seasonNumber}">
                    ${episodeList}
                    </ul><!--Siguiente temporada debajo-->
    
    
    
                    `;
    
                    const btnCopiar = document.getElementById('copiar');
    
                    if (seasonNumber == 1) {
                        template.innerText = justHtml;
                    } else if (seasonNumber > 1){
                        template.innerText = seasonOnly;
                    }
    
                    let templateHTML = template.innerText;
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })

                    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.name;
                    genSeasons.innerText = datos.number_of_seasons + genSeasonsCount;
                    genYear.innerText = datos.first_air_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }
        } else
        if(isMovie.checked){
            try {

            const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${serieKey}?api_key=c71d55c790adcb0fa9ea6ebcbc9a61a7&language=${languaje}`);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                let tags = '';
                console.log(datos)


                datos.genres.forEach((genre, index) => {
                    if (index > 2) {
                        return
                    }
                    tags += `${genre.name}, `          

                });


                    let template = document.getElementById('html-final');

                    let justHtml = `[stt/Pelicula]
[hd/HD]
[sc/${datos.vote_average.toFixed(1)}]

<!-- 
TITULO DE LA ENTRADA:     ${datos.title} - ${datos.release_date.slice(0,4)}
ETIQUETAS DE LA ENTRADA:   ${tags} Peliculas
IMAGEN DE FONDO:    https://image.tmdb.org/t/p/original${datos.backdrop_path}
-->

<span><!--more--></span>
<div class="infor">
<div class="entrada">
<div class="poster">
<img src="https://image.tmdb.org/t/p/w300/${datos.poster_path}"/>
</div>
<div class="detall">
<h1 class="bs-title">${datos.title}</h1>
<ul class="Eti"><li class="pel">Pelicula</li><li>${convertMinutes(datos.runtime)}</li><li>${datos.release_date.slice(0,4)}</li></ul>
<ul class="genero">
${tags}
</ul>
<ul class="califica">
<div class='porcentajes' style="--porcentaje: ${(datos.vote_average.toFixed())}${(datos.vote_average.toFixed(1) / 2).toFixed(1)}; --color: forestgreen"><svg width="43" height="43">
<circle r="19" cx="50%" cy="50%" pathlength="100" />
<circle r="19" cx="50%" cy="50%" pathlength="100" /></svg>
<span>${(datos.vote_average.toFixed())}${(datos.vote_average.toFixed(1) / 2).toFixed(1)}%</span>
  </div>
<li class="strella"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i></li><span>(${datos.vote_count})</span>
</ul>

<p class="sinopsis">M${datos.overview}</p>

</div>
</div>
<!--more-->
<ul class="botones">
<!-- Coloque el enlace del trailer /-->
<li><a href="https://www.youtube.com/watch?v=kg3Q63gzF6I" target="black"><i class="fa fa-youtube-play"></i><p> Ver Trailer</p></a></li>
<li><a href="#repro" class="btn-play"><i class="fa fa-play"></i><p> Reproducir</p></a></li>
<li><a class="x-linkPlus x-link2" id="dwnld-btn"><i class="fa fa-download"></i><p> Descargar</p></a></li>
</ul>
</div>

<div id="repro">
<!-- TABLA DE OPCIONES DE SERVIDORES /-->
<div class="repro-opciones">
<li><a id="btn-show-1" data-id="1" href="#1">Opcion 1</a></li>
<li><a id="btn-show-2" data-id="2" href="#2">Opcion 2</a></li>
</div>

<script>
var video = [];
video[1]=
'<iframe class="player_conte" src=" https://www.youtube.com/embed/kg3Q63gzF6I " scrolling="no" frameborder="0" allowfullscreen iframe>';
video[2]=
'<iframe class="player_conte" src=" https://www.youtube.com/embed/0yAHD2p7yrk " scrolling="no" frameborder="0" allowfullscreen ></iframe>';

</script>

<div class="col-lg-12">
<div class="text-center server-box">
<div id="video_box"></div>
</div>
</div>
</div>



<!-- TABLA DE DESCARGAS  /-->
<div class="download" id="todownload"><div class="contenedors"><div class="opciones-descarga">
<div class="titulo"> <i class="fa fa-download"><span> Descargas</span></i> <a>X</a></div>

<table>
<thead>
<tr>
<th scope="col">#</th><th>SERVIDOR</th><th>IDIOMA</th><th>DESCARGAR</th>
</tr>
</thead>
<tbody><tr><th>0</th><td>Mega</td><td>Subtitulado</td><td>
<a href="#" target="_blank" class="link"><span> Descargar</span></a>
</td></tr></tbody>
<tbody><tr><th>0</th><td>Mega</td><td>Subtitulado</td><td>
<a href="#" target="_blank" class="link"><span> Descargar</span></a>
</td></tr></tbody>
<!-- AGREGAR MAS  /-->
</table>

</div></div></div>

<!-- Copyrigt @plantillasplus.com - TMDB Movies -->

`;                  
                    template.innerText = justHtml;
                    let templateHTML = template.innerText;
                    
                    const btnCopiar = document.getElementById('copiar');
                    
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })
    
    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.title;
                    genSeasons.innerText = "";
                    genYear.innerText = datos.release_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }           
        }

    }

    cargarPeliculas();
}

generar();



