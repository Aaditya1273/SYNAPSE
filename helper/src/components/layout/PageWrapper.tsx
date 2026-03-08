export default function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="pt-24">
            {children}
        </div>
    );
}
