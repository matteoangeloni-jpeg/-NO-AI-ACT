/** The retired public preview channel serves redirects, never another game. */
export default {
 fetch(request){
  if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{'Cache-Control':'no-store'}});
  const url=new URL(request.url);url.protocol='https:';url.host='www.no-ai-act.eu';
  return new Response(null,{status:302,headers:{Location:url.href,'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow, noarchive'}});
 }
};
