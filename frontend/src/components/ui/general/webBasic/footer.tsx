import { Link } from 'react-router-dom'
import { Github } from "lucide-react"
import { useTranslation } from 'react-i18next'

export default function Footer() {
    const {t} = useTranslation();

    return (
        <footer className="py-8 mt-auto bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to={"/"} onClick={() => window.scrollTo(0, 0)}>
                                    {t('title')}
                                </Link>
                            </li>
                            <li>
                                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to={"/about/"} onClick={() => window.scrollTo(0, 0)}>
                                    {t('about')}
                                </Link>
                            </li>
                            <li>
                                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to={"/impressum/"} onClick={() => window.scrollTo(0, 0)}>
                                    Impressum
                                </Link>
                            </li>
                            <li>
                                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" to={"/privacypolicy/"} onClick={() => window.scrollTo(0, 0)}>
                                    Datenschutzerklärung
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Open Source</h3>
                        <div className="flex">
                            <a href="https://github.com/mst2k/programmierprojekt" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                <Github size={20} />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-muted-foreground/20">
    <p className="text-center text-sm text-muted-foreground space-y-2">
        <span className="block">
            <strong className="text-primary">
            <a 
                href="https://github.com/mst2k/programmierprojekt" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('orsolverf')}
            </a>
            </strong> - {t('devwith')}
        </span>
        <span className="block">
            {`${new Date().getFullYear()} ${t('lic')} `}
            <a 
                href="https://github.com/mst2k/programmierprojekt/blob/main/LICENSE" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                GNU General Public License
            </a>
        </span>
    </p>
</div>
            </div>
        </footer>
    )
}