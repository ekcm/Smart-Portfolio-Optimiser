interface ErrorProps {
    error: string
}

export default function Error({ error }: ErrorProps) {
    return (
        <div className="flex justify-center w-screen pt-10">
            <div>Sorry, we ran into an error:</div>
            <div>{error}</div>
        </div>
    );
}
