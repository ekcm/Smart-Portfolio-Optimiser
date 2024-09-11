import './loader.css';

// TODO: Fix the loader to centralise to screen
export default function Loader() {
    return (
            <div className="flex flex-grow items-center justify-center mt-20">
                <div className="loader"></div>
            </div>
    );
}