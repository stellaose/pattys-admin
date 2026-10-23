"use client";
import React from "react";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { endpoints } from "#/model/endpoints";
import { ContactMessage } from "#services/types";
import { DateCell, ListPage, PersonCell } from "#components/elements/admin";

const columns: ColumnsType<ContactMessage> = [
  {
    title: "From",
    key: "from",
    width: 240,
    render: (_, contact) => (
      <PersonCell name={contact.name || "Anonymous"} detail={contact.email} />
    ),
  },
  {
    title: "Message",
    key: "message",
    render: (_, contact) => (
      <span className="flex flex-col gap-1">
        {contact.topic && (
          <Tag variant="filled" className="!m-0 w-fit capitalize">
            {contact.topic}
          </Tag>
        )}
        <span className="whitespace-pre-line text-sm font-arial text-black-200">
          {contact.message}
        </span>
      </span>
    ),
  },
  {
    title: "Sent",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (iso: string) => <DateCell iso={iso} />,
  },
];

const ContactPage = () => (
  <ListPage<ContactMessage>
    title="Contact messages"
    subtitle="Messages sent through the contact form"
    url={endpoints.contacts.all}
    dataKey="contacts"
    rowKey="contactId"
    columns={columns}
    searchPlaceholder="Search name, e-mail or message"
    emptyText="No messages match your search."
  />
);

export default ContactPage;
