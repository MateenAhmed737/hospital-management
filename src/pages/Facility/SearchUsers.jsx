import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Empty, Loader, Page } from "@/components";
import { UserProfileCard } from "@/components/Cards/Facility";
import { base_url } from "@/utils/url";

const getUsers = `${base_url}/get-users`;
const getTypes = `${base_url}/get-services`;

export default function SearchUsers() {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchSearchUsers = () => {
      setLoading(true);

      fetch(getUsers)
        .then((res) => res.json())
        .then((res) => setData(res.success.data.slice().reverse()))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };
    const fetchTypes = () => {
      setLoading(true);

      fetch(getTypes)
        .then((res) => res.json())
        .then((res) => setTypes(res.success.data.slice()))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    };

    fetchSearchUsers();
    fetchTypes();
  }, [user]);

  return (
    <Page title="Search Users" enableHeader>
      <main className="relative min-h-[80vh] flex flex-col">
        {loading ? (
          <Loader />
        ) : data.length > 0 ? (
          data.map((item) => (
            <UserProfileCard
              key={item?.id}
              {...item}
              type={types.find((e) => e.id == item.type_id)?.service_name}
            />
          ))
        ) : (
          <Empty title="No users found." />
        )}
      </main>
    </Page>
  );
}
