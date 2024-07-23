// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, Dimensions, Alert } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const CELL_SIZE = 20;
const BOARD_SIZE = 300;

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
    const [food, setFood] = useState({ x: 100, y: 100 });
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(moveSnake, 200);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, direction]);

    const moveSnake = () => {
        setSnake((prevSnake) => {
            const newHead = {
                x: (prevSnake[0].x + direction.x * CELL_SIZE + BOARD_SIZE) % BOARD_SIZE,
                y: (prevSnake[0].y + direction.y * CELL_SIZE + BOARD_SIZE) % BOARD_SIZE,
            };

            if (checkCollision(newHead, snake)) {
                Alert.alert('Game Over', 'You lost the game', [{ text: 'OK', onPress: () => setIsPlaying(false) }]);
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];
            if (newHead.x === food.x && newHead.y === food.y) {
                placeFood();
            } else {
                newSnake.pop();
            }
            return newSnake;
        });
    };

    const checkCollision = (head, snake) => {
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    };

    const placeFood = () => {
        const x = Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE;
        const y = Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE;
        setFood({ x, y });
    };

    const changeDirection = (x, y) => {
        const newDirection = { x, y };
        setDirection(newDirection);
    };

    const handleGesture = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            if (Math.abs(nativeEvent.translationX) > Math.abs(nativeEvent.translationY)) {
                if (nativeEvent.translationX > 0) {
                    changeDirection(1, 0);
                } else {
                    changeDirection(-1, 0);
                }
            } else {
                if (nativeEvent.translationY > 0) {
                    changeDirection(0, 1);
                } else {
                    changeDirection(0, -1);
                }
            }
        }
    };

    return (
        <View style={styles.gameContainer}>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <View>
                    <View style={styles.board}>
                        {snake.map((segment, index) => (
                            <View key={index} style={[styles.cell, { left: segment.x, top: segment.y }]} />
                        ))}
                        <View style={[styles.food, { left: food.x, top: food.y }]} />
                    </View>
                </View>
            </PanGestureHandler>
            <Button title={isPlaying ? "Pause" : "Start"} onPress={() => setIsPlaying(!isPlaying)} />
        </View>
    );
};

const snakeGameStyles = StyleSheet.create({
    gameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        backgroundColor: '#E5E5E5',
        position: 'relative',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
});

export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
});