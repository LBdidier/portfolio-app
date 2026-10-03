// Shows errors on the page instead of a blank screen (helps diagnose problems).
function show(msg){var r=document.getElementById('root');if(r&&!r.children.length){r.innerHTML='<div style="font-family:monospace;padding:24px;color:#b42318"><b>Dashboard failed to load</b><br><br>'+String(msg).replace(/</g,'&lt;')+'<br><br>Press F12 and send me the Console text.</div>';}}
window.addEventListener('error',function(e){show(e.message||'Script error')});
window.addEventListener('unhandledrejection',function(e){show(e.reason&&e.reason.message||e.reason)});
setTimeout(function(){var r=document.getElementById('root');if(r&&!r.children.length)show('Nothing rendered after 3 seconds. The page scripts may not have loaded.')},3000);
