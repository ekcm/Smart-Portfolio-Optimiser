import './menuloader.css';

// TODO: Fix the loader to centralise to screen
export default function MenuLoader() {
    return (
            <div className="flex flex-grow items-center justify-center my-4">
                <div className="loader"></div>
            </div>
    );
}