import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useHistory } from "react-router-dom";

export const Meme = () => {

    const [memes, setMemes] = useState([]);
    const [index, setIndex] = useState(0);
    const [captions, setCaptions] = useState([]);

    const history = useHistory();

    const updateCaption = (e, index) => {
        const text = e.target.value || '';
        setCaptions(
            captions.map((c, i) => {
                if (index === i) {
                    return text;
                } else {
                    return c;
                }
            })
        )
    }

    const generateMeme = () => {
        const currentMeme = memes[index];
        const formData = new FormData();

        formData.append("username", process.env.USERNAME);
        formData.append("password", process.env.PASSWORD);
        formData.append("template_id", currentMeme.id);
        captions.forEach((c, index) => {
            formData.append(`boxes[${index}][text]`, c)
        })
        fetch('https://api.imgflip.com/caption_image', {
            method: "POST",
            body: formData
        }).then(res => {
            return res.json();
        }).then(res => {
            // console.log(res);
            history.push(`/generated?url=${res.data.url}`);
        })
    }

    const shuffleMemes = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => {
                return res.json();
            }).then(res => {
                // console.log(res.data.memes);
                const returnedMemes = res.data.memes;
                shuffleMemes(returnedMemes);
                setMemes(returnedMemes);
            })
    }, []);

    useEffect(() => {
        if (memes.length > 0) {
            setCaptions(Array(memes[index].box_count).fill(""));
        }
    }, [index, memes]);

    return (
        memes.length ?
            <div className={styles.container}>
                <h2>Generate your meme</h2>
                <img src={memes[index].url} alt="meme" />
                <button onClick={() => { setIndex(index + 1) }} className={styles.skip}>Skip</button>
                {
                    captions.map((c, index) => (
                        <input onChange={(e) => updateCaption(e, index)} key={index} type="text" />
                    ))
                }
                <button onClick={generateMeme} className={styles.generate}>Generate</button>
            </div>
            : <h2>Loading...</h2>
    );
}