import {  Col,  Image,  Row } from "antd";
import React from "react";

type AuthenLayoutProps = {
    children: React.ReactNode;
}

function AuthenLayout({children}: AuthenLayoutProps) {
  return (
    <Row align={"middle"} gutter={30}>
        <Col span={12}>
            <Image src="https://cdna.artstation.com/p/assets/images/images/026/978/152/large/marcel-van-tonder-koi-fish-vision-x.jpg?1590253278"/>
        </Col> {/*cai nay la cot */}
        <Col span={12}>
        {children}
        </Col> {/*cai nay la form */}
    </Row>
   
  );
}

export default AuthenLayout;