import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menuItems = [
    {
        to: "/dashboard",
        label: "Áttekintés",
        icon: "bi-speedometer2",
        roles: ["admin", "teacher", "parent"],
    },
    {
        to: "/students",
        label: "Diákok",
        icon: "bi-people",
        roles: ["admin", "teacher", "parent"],
    },
    {
        to: "/teachers",
        label: "Tanárok",
        icon: "bi-person-badge",
        roles: ["admin"],
    },
    {
        to: "/classes",
        label: "Osztályok",
        icon: "bi-building",
        roles: ["admin", "teacher"],
    },
    {
        to: "/subjects",
        label: "Tantárgyak",
        icon: "bi-book",
        roles: ["admin", "teacher"],
    },
    {
        to: "/attendances",
        label: "Jelenlét",
        icon: "bi-calendar-check",
        roles: ["admin", "teacher", "parent"],
    },
    {
        to: "/timetables",
        label: "Órarend",
        icon: "bi-calendar3",
        roles: ["admin", "teacher", "parent"],
    },
    {
        to: "/exams",
        label: "Vizsgák",
        icon: "bi-file-text",
        roles: ["admin", "teacher", "parent"],
    },
    {
        to: "/fees",
        label: "Díjak",
        icon: "bi-cash-coin",
        roles: ["admin", "parent"],
    },
    {
        to: "/library",
        label: "Könyvtár",
        icon: "bi-journal-bookmark",
        roles: ["admin", "teacher"],
    },
    {
        to: "/transports",
        label: "Közlekedés",
        icon: "bi-bus-front",
        roles: ["admin"],
    },
    {
        to: "/notifications",
        label: "Értesítések",
        icon: "bi-bell",
        roles: ["admin", "teacher", "parent"],
    },
];

export default function Sidebar() {
    const { user } = useAuth();

    const visibleItems = menuItems.filter((item) =>
        item.roles.includes(user?.role),
    );

    return (
        <aside className="bg-white border-end" style={{ width: "240px" }}>
            <nav className="nav flex-column p-3">
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center gap-2 rounded mb-1 ${
                                isActive
                                    ? "active bg-primary text-white"
                                    : "text-dark"
                            }`
                        }
                    >
                        <i className={`bi ${item.icon}`}></i>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
