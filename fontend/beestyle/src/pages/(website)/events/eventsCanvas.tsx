import React, { useEffect, useRef } from 'react'

type Props = {}

const EventsCanvas = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        // Kiểm tra nếu canvasRef.current không phải là null
        const canvas: any = canvasRef.current;
        if (canvas) {
            const ctx: any = canvas.getContext('2d');
            if (ctx) {
                // Cập nhật kích thước canvas theo kích thước cửa sổ
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Tạo các hạt tuyết
                const snowflakes: any = [];
                for (let i = 0; i < 100; i++) {
                    snowflakes.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 4 + 1,
                        speed: Math.random() * 1 + 0.5,
                    });
                }

                function drawSnowflakes() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'lightblue';
                    ctx.beginPath();
                    for (const flake of snowflakes) {
                        ctx.moveTo(flake.x, flake.y);
                        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                    }
                    ctx.fill();
                }

                function updateSnowflakes() {
                    for (const flake of snowflakes) {
                        flake.y += flake.speed;
                        if (flake.y > canvas.height) {
                            flake.y = -flake.radius;
                            flake.x = Math.random() * canvas.width;
                        }
                    }
                }

                function animateSnowfall() {
                    drawSnowflakes();
                    updateSnowflakes();
                    requestAnimationFrame(animateSnowfall);
                }

                animateSnowfall();

                // Cập nhật kích thước canvas khi thay đổi kích thước cửa sổ
                const handleResize = () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    snowflakes.length = 0;
                    for (let i = 0; i < 100; i++) {
                        snowflakes.push({
                            x: Math.random() * canvas.width,
                            y: Math.random() * canvas.height,
                            radius: Math.random() * 4 + 1,
                            speed: Math.random() * 1 + 0.5,
                        });
                    }
                };

                window.addEventListener('resize', handleResize);
                return () => window.removeEventListener('resize', handleResize);
            }
        }
    }, []);
    return (
        <canvas ref={canvasRef} className="snow-canvas fixed z-40 top-0 pointer-events-none"></canvas>
    )
}

export default EventsCanvas