import Layout from "../../components/layout/Layout";

function CompanyPage() {
    return (
        <Layout>

            <h1 className="text-4xl font-bold mb-6">
                Company Management
            </h1>

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex justify-between mb-6">

                    <h2 className="text-2xl font-semibold">
                        Companies
                    </h2>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                        + Add Company
                    </button>

                </div>

                <table className="w-full">

                    <thead className="border-b">

                    <tr className="text-left">

                        <th className="py-3">Name</th>
                        <th>Registration No.</th>
                        <th>Email</th>
                        <th>Employees</th>

                    </tr>

                    </thead>

                    <tbody>

                    <tr>

                        <td className="py-4">ABC Pvt Ltd</td>
                        <td>REG-1001</td>
                        <td>abc@gmail.com</td>
                        <td>120</td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </Layout>
    );
}

export default CompanyPage;