import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeContent,localized,type RawContent} from '../src/lib/content-model';
import {socialLinks} from '../src/lib/social-links';
import {defaultText} from '../src/lib/content-defaults';

const image={_type:'image' as const,asset:{url:'https://cdn.sanity.io/images/1yijqk34/production/f1380206dbf6752a4f265604ffa05e942c623782-768x1024.webp'},crop:{left:0.1,right:0,top:0.05,bottom:0},hotspot:{x:0.7,y:0.3,width:0.2,height:0.2},alt:{da:'Beskrivelse',en:'Description'},credit:'Approved photographer'};
const fixture=():RawContent=>({settings:{contactEmail:'artist@example.com',text:{...defaultText,readMore:{da:'Se mere',en:'View more'}},brand:{logo:{asset:{url:'https://cdn.sanity.io/files/1yijqk34/production/approved.svg'}}}},artists:[{_id:'artist-example',name:'Example',slug:'example',description:{da:'Dansk',en:'English'},achievements:[],color:'#DF597D',image,links:[{label:'Legacy',url:'https://example.com'}],socialProfiles:[{_key:'ig',platform:'Instagram',url:'https://www.instagram.com/example/',label:{da:'Følg',en:'Follow'},showOnCard:true,showInDetails:false}],spotifyArtistUrl:'https://open.spotify.com/artist/abc123',card:{showSpotify:false}}]});
const normalize=(raw:RawContent)=>normalizeContent(raw,'1yijqk34','production');

test('CMS fields reach the shared view model, preserving photographer and localized content',()=>{
 const data=normalize(fixture());assert.equal(data.contactEmail,'artist@example.com');assert.equal(data.text.readMore.en,'View more');assert.equal(data.brand.logo,'https://cdn.sanity.io/files/1yijqk34/production/approved.svg');assert.equal(data.artists[0].imageCredit,'Approved photographer');assert.equal(localized(data.artists[0].description,'en'),'English');
});
test('crop and hotspot affect all correctly sized image variants',()=>{
 const data=normalize(fixture()).artists[0];const square=new URL(data.imageUrl!);const hero=new URL(data.heroImageUrl!);const thumb=new URL(data.thumbImageUrl!);
 assert.equal(square.searchParams.get('w'),'1200');assert.equal(square.searchParams.get('h'),'1200');assert.equal(hero.searchParams.get('h'),'1080');assert.equal(thumb.searchParams.get('w'),'160');assert(square.searchParams.has('rect'));assert.notEqual(hero.searchParams.get('rect'),square.searchParams.get('rect'));
});
test('clearing managed profiles stays empty instead of restoring legacy links',()=>{
 const raw=fixture();raw.artists![0].socialProfiles=[];assert.deepEqual(normalize(raw).artists[0].links,[]);
 delete raw.artists![0].socialProfiles;assert.equal(normalize(raw).artists[0].links[0].label,'Legacy');
});
test('card visibility and link order are independent of artist details',()=>{
 const artist=normalize(fixture()).artists[0];assert.deepEqual(socialLinks(artist).map(l=>l.platform),['Instagram']);assert.equal(artist.links[0].showInDetails,false);
 artist.links.unshift({_key:'fb',platform:'Facebook',label:'Facebook',url:'https://www.facebook.com/example/',showOnCard:false});assert.deepEqual(socialLinks(artist).map(l=>l.platform),['Instagram']);
 artist.links[0].showOnCard=true;assert.deepEqual(socialLinks(artist).map(l=>l.platform),['Facebook','Instagram']);
});
test('invalid link protocols and incomplete drafts are handled safely',()=>{
 const raw=fixture();raw.artists![0].socialProfiles!.push({label:'Bad',url:'javascript:alert(1)'});assert.equal(normalize(raw).artists[0].links.length,1);
 const empty=normalizeContent({settings:null,privacy:null,artists:[]},'1yijqk34','production');assert.equal(empty.brand.name,'Mellow Management');assert.equal(empty.privacy.sections.length,6);assert.deepEqual(empty.artists,[]);
});
