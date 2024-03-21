import React, {useContext, useEffect, useRef} from "react";
import GraphPrinter from "./GraphPrinter";
import {DotsFormContext} from "../InputFileds/InputFieldContext";
import {getAuthHeader} from "../../redux/authorizationStore";
import toast from "react-hot-toast";
import {serverBasePath} from "../../index";


function Graph({width, height}: {width: number, height: number}){
    const context = useContext(DotsFormContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    function fetchCoordinates(x: number, y: number, r: number):void{
        let data = {
            "x": x.toFixed(4),
            "y": y.toFixed(4),
            "r": r.toFixed(4)
        }
        fetch(serverBasePath + "/api/dots", {
            method: "POST",
            headers: {"Authorization": getAuthHeader()},
            body: JSON.stringify(data)
        })
            .then(r => {
                if (r.ok) return r
                else throw new Error(r.statusText)
            })
            .then(r => r.json())
            .then(r => {
                context?.addDot(r)
            })
            .catch(e => toast.error(e.message));
    }

    function parseClick(event: React.MouseEvent<HTMLCanvasElement>){
        if(!canvasRef.current) return
        if(context && context.getR <= 0) {
            toast.error("Fill R");
            return
        }
        const xPixels = event.clientX - canvasRef.current.getBoundingClientRect().left;
        const yPixels = event.clientY - canvasRef.current.getBoundingClientRect().top;
        const SIZE = width;
        const WIDTH_IN_POINTS = 10
        const pointInPixels = SIZE / WIDTH_IN_POINTS;
        const x = (- (SIZE / 2 - xPixels) / pointInPixels)
        const y = ((SIZE / 2 - yPixels) / pointInPixels)
        sendCoordinates(x, y)
    }

    function sendCoordinates(x: number, y: number){
        if(!context) return
        let data = {
            "x": x.toFixed(4),
            "y": y.toFixed(4),
            "r": context.getR.toString()
        }
        fetch(serverBasePath + "/api/dots", {
            method: "POST",
            headers: {"Authorization": getAuthHeader()},
            body: JSON.stringify(data)
        })
            .then(r => {
                if (r.ok) return r
                else throw new Error(r.statusText)
            })
            .then(r => r.json())
            .then(r => {
                context.addDot(r)
            })
            .catch(e => toast.error(e.message));
    }

    useEffect(() => {
        if (!canvasRef?.current?.getContext('2d')) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if(ctx === null) return;
        const graphPrinter = new GraphPrinter(canvas, ctx, context?.getR, context?.getDots, fetchCoordinates);
        graphPrinter.drawStartImage();
    }, [context?.getR, context?.getDots]);
    return (
        <canvas ref={canvasRef}
                width={width}
                height={height}
                key={context?.getR}
                onClick={parseClick}
        />
    );
}

export default Graph;
