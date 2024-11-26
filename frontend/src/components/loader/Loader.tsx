import './loader.css';

export default function Loader() {
    return (
            <div className="flex flex-col flex-grow items-center justify-between h-16 my-8">
                <div className="text-xl">Loading</div>
                <div className="loader"></div>
            </div>
    );
}