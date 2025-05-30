"use client";

import { JSX, useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHome,
  faBriefcase,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import PaginationControls from "@/components/PaginationControls";

type Manner = {
  id: string;
  title: string;
  description: string;
  category: string;
};

const categoryMap: Record<string, { label: string; icon: JSX.Element }> = {
  all: { label: "Tất Cả", icon: <FontAwesomeIcon icon={faBook} /> },
  school: { label: "Học Đường", icon: <FontAwesomeIcon icon={faSchool} /> },
  family: { label: "Gia Đình", icon: <FontAwesomeIcon icon={faHome} /> },
  work: { label: "Công Sở", icon: <FontAwesomeIcon icon={faBriefcase} /> },
  general: { label: "Chung", icon: <FontAwesomeIcon icon={faBook} /> },
};

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [manners, setManners] = useState<Manner[]>([]);
  const [selected, setSelected] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchManners = async () => {
      const snapshot = await getDocs(collection(db, "manners"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Manner[];
      setManners(data);
    };
    fetchManners();
  }, []);

  const filtered =
    selected === "all"
      ? manners
      : manners.filter((m) => m.category === selected);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelect = (category: string) => {
    setSelected(category);
    setCurrentPage(1);
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 fw-bold">
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Phép Đối Nhân Xử Thế
      </h1>
      <p className="text-center text-muted mb-5 fs-5">
        Tìm hiểu các quy tắc ứng xử đúng mực trong các bối cảnh xã hội.
      </p>

      <div className="d-flex justify-content-center mb-5 flex-wrap gap-3">
        {Object.entries(categoryMap).map(([key, { label, icon }]) => (
          <Button
            key={key}
            onClick={() => handleSelect(key)}
            variant={selected === key ? "primary" : "outline-primary"}
            className="fw-medium d-flex align-items-center gap-2 px-4 py-2"
          >
            {icon}
            {label}
          </Button>
        ))}
      </div>

      <Row>
        <AnimatePresence>
          {paginated.map((manner) => (
            <Col key={manner.id} md={6} lg={4} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="text-primary fw-semibold d-flex align-items-center gap-2">
                      {categoryMap[manner.category]?.icon || (
                        <FontAwesomeIcon icon={faBook} />
                      )}
                      {manner.title}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      {manner.description}
                    </Card.Text>
                    <span className="badge bg-primary text-white">
                      {categoryMap[manner.category]?.label || "Không xác định"}
                    </span>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </AnimatePresence>
      </Row>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Container>
  );
}
