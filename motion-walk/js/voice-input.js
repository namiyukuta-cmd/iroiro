window.DungeonVoice = (() => {
  const normalize=t=>t.normalize('NFKC').replace(/[\s、。！？!?.,]/g,'');
  function parse(text,commands){const n=normalize(text);return Object.keys(commands).find(k=>commands[k].some(word=>normalize(word)===n))||null;}
  function create({commands,onCommand,onStatus,onHeard}){
    const API=window.SpeechRecognition||window.webkitSpeechRecognition;
    let wanted=false,recognition=null,timer=null,failures=0;
    function stop(message='マイク停止中'){wanted=false;clearTimeout(timer);if(recognition)recognition.abort();onStatus(message,false);}
    function start(){
      if(!wanted||document.hidden)return;
      const r=new API();recognition=r;r.lang='ja-JP';r.continuous=true;r.interimResults=false;r.maxAlternatives=1;
      const seen=new Set();
      r.onstart=()=>{if(wanted)onStatus('聞き取り中',true);else r.abort();};
      r.onresult=e=>{
        if(!wanted||document.hidden)return;
        for(let i=e.resultIndex;i<e.results.length;i++){
          if(!e.results[i].isFinal||seen.has(i))continue;seen.add(i);failures=0;
          const text=e.results[i][0].transcript;onHeard(text);const cmd=parse(text,commands);
          if(cmd)onCommand(cmd);else onStatus('聞き取り中：指示に一致しません',true);
        }
      };
      r.onerror=e=>{
        if(!wanted)return;
        if(e.error==='no-speech')return;
        const messages={'not-allowed':'マイクが許可されていません','service-not-allowed':'音声認識を利用できません','audio-capture':'マイクを利用できません','network':'音声認識の通信に失敗しました','language-not-supported':'日本語の音声認識に未対応です'};
        stop((messages[e.error]||'音声認識が止まりました')+'。音声開始で再試行。');
      };
      r.onend=()=>{
        if(recognition!==r)return;recognition=null;
        if(!wanted)return;
        failures++;
        if(failures>4){stop('聞き取りが終了しました。音声開始で再開。');return;}
        onStatus('再接続中',true);timer=setTimeout(start,500);
      };
      try{r.start();}catch{stop('音声開始を押して再試行してください。');}
    }
    function toggle(){if(wanted){stop();return;}if(!API){onStatus('このブラウザは音声認識に未対応です',false);return;}wanted=true;failures=0;onStatus('マイク接続中',true);start();}
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('マイク停止中：音声開始で再開');});
    window.addEventListener('pagehide',()=>stop());
    return {toggle,stop,supported:!!API};
  }
  return {create,parse};
})();
