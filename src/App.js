import './App.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import Scroll from './components/Scroll';

function  App() {
    const [needToFetchData, setNeedToFetchData] = useState(true);
    const [wikiData, setWikiData] = useState();

     const extractAPIContents = (json) => {
        const { pages } = json.query;
        return Object.keys(pages).map(id => pages[id].extract);
      }

    const countWords = (textArr) => {
        var countArr = {};
        for(var i = 0; i < textArr.length; i++){
            var word = textArr[i];
            if(word == "") continue;
            if(!countArr[word]){
                countArr[word] = 1;
            }else{
                countArr[word] = countArr[word] + 1;
            }
        }
        return countArr;
    }

    useEffect(() => {
        if(!needToFetchData) return;

        const fetchData = async () => {
        const wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=NASA';
        var response = await fetch(wikiUrl);
        try{
            const json = await response.json();
            var html = extractAPIContents(json);
            setWikiData(html);
            setNeedToFetchData(false);
            var stripedHtml = html[0].replace(/<[^>]+>/g, '');
            stripedHtml = stripedHtml.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");
            var stripedHtmlArr = stripedHtml.split(" ");
            var countArr = countWords(stripedHtmlArr);
            //countArr.sort((a,b) => a.last_nom - b.last_nom);
            console.log(countArr);
        }catch(error){
           console.log("Failed to parse wiki json: ", error);
        }
        }

        fetchData().catch(console.error);

    });


  return (
    <div className="App">
      <header className="App-header">
        <div className="tc bg-green ma0 pa4 min-vh-100">
        </div>
         <Scroll>
                       {wikiData ? wikiData.map(content => (
                           <div dangerouslySetInnerHTML={{ __html: content }} />
                         )): null}
              </Scroll>
      </header>
    </div>
  );
}

export default App;
