import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";


export default function useWebSocket(
    url,
    options = {}
) {
    const BASE_URL =
        import.meta.env.VITE_WS_URL ||
        "ws://localhost:8000";


    const socketRef = useRef(null);


    const [connected, setConnected] =
        useState(false);

    const [connectionStatus, setConnectionStatus] =
        useState("disconnected");

    const [lastMessage, setLastMessage] =
        useState(null);


    const {
        onOpen,
        onClose,
        onError,
        onMessage,
        onRefresh,
        reconnect = false,
        reconnectInterval = 3000,
    } = options;


    useEffect(() => {

        if (!url) {
            return;
        }


        let socket;
        let reconnectTimer;


        const connect = () => {

            try {

                /*
                |--------------------------------------------------------------------------
                | Get Access Token
                |--------------------------------------------------------------------------
                */

                let accessToken =
                    localStorage.getItem("token");


                /*
                |--------------------------------------------------------------------------
                | Fallback: authTokens
                |--------------------------------------------------------------------------
                */

                if (!accessToken) {

                    const authTokens =
                        localStorage.getItem(
                            "authTokens"
                        );

                    if (authTokens) {

                        try {

                            const parsedTokens =
                                JSON.parse(authTokens);

                            accessToken =
                                parsedTokens.access;

                        } catch (error) {

                            console.error(
                                "Failed to parse authTokens:",
                                error
                            );

                        }
                    }
                }


                /*
                |--------------------------------------------------------------------------
                | No Token
                |--------------------------------------------------------------------------
                */

                if (!accessToken) {

                    console.warn(
                        "No access token found."
                    );

                    setConnectionStatus(
                        "unauthorized"
                    );

                    return;
                }


                /*
                |--------------------------------------------------------------------------
                | Connecting
                |--------------------------------------------------------------------------
                */

                setConnectionStatus(
                    "connecting"
                );


                /*
                |--------------------------------------------------------------------------
                | WebSocket URL
                |--------------------------------------------------------------------------
                */

                const separator =
                    url.includes("?")
                        ? "&"
                        : "?";


                const websocketUrl =
                    `${BASE_URL}${url}${separator}token=${encodeURIComponent(accessToken)}`;


                console.log(
                    "Connecting WebSocket:",
                    `${BASE_URL}${url}`
                );


                socket =
                    new WebSocket(
                        websocketUrl
                    );


                socketRef.current =
                    socket;


                /*
                |--------------------------------------------------------------------------
                | Connected
                |--------------------------------------------------------------------------
                */

                socket.onopen = async () => {

                    setConnected(true);

                    setConnectionStatus(
                        "connected"
                    );


                    onOpen?.();


                    await onRefresh?.();
                };


                /*
                |--------------------------------------------------------------------------
                | Message
                |--------------------------------------------------------------------------
                */

                socket.onmessage = (event) => {

                    let payload =
                        event.data;


                    try {

                        payload =
                            JSON.parse(
                                event.data
                            );

                    } catch {
                        // Message isn't JSON
                    }


                    setLastMessage(
                        payload
                    );


                    onMessage?.(
                        payload
                    );
                };


                /*
                |--------------------------------------------------------------------------
                | Error
                |--------------------------------------------------------------------------
                */

                socket.onerror = (error) => {

                    console.error(
                        "WebSocket error:",
                        error
                    );

                    onError?.(
                        error
                    );
                };


                /*
                |--------------------------------------------------------------------------
                | Close
                |--------------------------------------------------------------------------
                */

                socket.onclose = (
                    event
                ) => {

                    setConnected(
                        false
                    );

                    setConnectionStatus(
                        "disconnected"
                    );


                    onClose?.(
                        event
                    );


                    if (reconnect) {

                        reconnectTimer =
                            setTimeout(
                                connect,
                                reconnectInterval
                            );
                    }
                };

            } catch (error) {

                console.error(
                    "WebSocket connection failed:",
                    error
                );

                setConnectionStatus(
                    "error"
                );
            }
        };


        connect();


        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */

        return () => {

            clearTimeout(
                reconnectTimer
            );


            if (
                socket &&
                socket.readyState ===
                    WebSocket.OPEN
            ) {

                socket.close();

            } else if (socket) {

                socket.close();
            }
        };

    }, [
        url,
        reconnect,
        reconnectInterval,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Send Message
    |--------------------------------------------------------------------------
    */

    const sendMessage =
        useCallback(
            (data) => {

                if (
                    socketRef.current
                        ?.readyState !==
                    WebSocket.OPEN
                ) {

                    console.warn(
                        "WebSocket is not connected."
                    );

                    return;
                }


                socketRef.current.send(
                    typeof data === "string"
                        ? data
                        : JSON.stringify(data)
                );
            },
            []
        );


    return {
        socket:
            socketRef.current,

        connected,

        connectionStatus,

        lastMessage,

        sendMessage,
    };
}