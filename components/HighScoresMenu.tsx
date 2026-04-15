import { getHighScores, HighScore } from "@/constants/Storage";
import SimplePopupView from "./SimplePopupView";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import StylizedButton from "./StylizedButton";
import { cssColors } from "@/constants/Color";
import { GameModeType, useSetAppState } from "@/hooks/useAppState";

export default function HighScores() {
    const [ setAppState, _appendAppState, popAppState ] = useSetAppState();
    const [ highScores, setHighScores ] = useState<HighScore[]>([]);
    const [ gameMode, setGameMode ] = useState(GameModeType.Classic);
    
    useEffect(() => {
        getHighScores(gameMode, true, true, 10).then((value) => {
            setHighScores(value);
        });
    }, [gameMode, setHighScores]);

    return <SimplePopupView style={[{justifyContent: 'flex-start'}]}>
        <StylizedButton text="戻る" onClick={popAppState} backgroundColor={cssColors.spaceGray}></StylizedButton>
        { highScores.length > 0 &&
            <>
                <Text style={styles.subHeader}>
                    {"モードを選択"}
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <StylizedButton text="クラシック" onClick={() => { setGameMode(GameModeType.Classic) }} backgroundColor={cssColors.accentWarm}></StylizedButton>
                    <StylizedButton text="カオス" onClick={() => { setGameMode(GameModeType.Chaos) }} backgroundColor={cssColors.ink} textColor="white"></StylizedButton>
                </View>
                <Text style={styles.header}>
                    {"クラシック ハイスコア TOP10"}
                </Text>
                <Text style={styles.subHeader}>
                    {"スコア順"}
                </Text>
                {
                    highScores.map((score, idx) => {
                        return <Score key={idx} rank={idx + 1} score={score}/>
                    })
                }
            </>
        }
        { highScores.length == 0 && 
            <>
                <Text style={styles.noScoresText}>{"まだスコアがありません"}</Text>
                <StylizedButton text="クラシックで遊ぶ" onClick={() => {
                    setAppState(GameModeType.Classic)
                }} backgroundColor={cssColors.accentWarm}></StylizedButton>
                <StylizedButton text="カオスで遊ぶ" onClick={() => {
                    setAppState(GameModeType.Chaos)
                }} backgroundColor={cssColors.ink} textColor="white" borderColor="white"></StylizedButton>
            </>
        }
    </SimplePopupView>
}

function Score({score, rank}: {score: HighScore, rank: number}) {
    return <>
        <Text style={styles.scoreValueText}>{"#" + String(rank) + " - " + String(score.score)}</Text>
        <Text style={styles.scoreTimeText}>{createTimeAgoString(score.date)}</Text>
    </>
}

function createTimeAgoString(date: number): string {
    const now = new Date();
    const seconds = Math.round((now.getTime() - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);
  
    if (seconds < 60) {
      return seconds <= 0 ? 'now' : `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 30) {
      return `${days} days ago`;
    } else if (months < 12) {
      return `${months} months ago`;
    } else {
      return `${years} years ago`;
    }
  }

const styles = StyleSheet.create({
    noScoresText: {
        color: 'rgb(30, 30, 30)',
        fontSize: 28,
        fontFamily: 'Silkscreen',
        textAlign: 'center',
        marginBottom: 20
    },
    scoreValueText: {
        color: 'rgb(30, 30, 30)',
        fontSize: 26,
        fontFamily: 'Silkscreen'
    },
    scoreTimeText: {
        color: 'rgb(120, 120, 120)',
        fontSize: 14,
        fontFamily: 'Silkscreen'
    },
    header: {
        color: 'rgb(30, 30, 30)',
        fontSize: 24,
        fontFamily: 'Silkscreen'
    },
    subHeader: {
        color: 'rgb(120, 120, 120)',
        fontSize: 18,
        fontFamily: 'Silkscreen'
    }
});
