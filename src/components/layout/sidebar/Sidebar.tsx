import logo from "../../../assets/navbar/logo.svg";
// import plus from "../../../assets/dashboard/plus.svg";
import plus from "../../../assets/workspace/add.svg";
import avatar from "../../../assets/dashboard/avatar.svg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "../../../store/useWorkspace";
import { useEffect } from "react";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
import styled from "@emotion/styled";
import { useAccount } from "wagmi";
import { useAuthStore } from "../../../store/useAuthStore";
import Version from "../../version";
import { getChainLogo } from "../../../utils/chain";

// const Sidebar = ({ children }: { children: React.ReactNode }) => {
const Sidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();

  const { address } = useAccount();
  const { user } = useAuthStore();
  const { getUserWorkspace, userWorkspaces, getWorkspaceDetails, workspace } =
    useWorkspace();
  const { isLoading } = useLoading();

  useEffect(() => {
    getUserWorkspace();
  }, [getUserWorkspace]);

  // fetch single workspace
  const handleFetchWorkspaceDetails = (workspaceId: number) => {
    getWorkspaceDetails(workspaceId, navigate);
  };

  useEffect(() => {
    if (address && user?.wallet && address !== user.wallet) {
      navigate("/login");
    }
  }, [address, user]);
  console.log(getChainLogo(workspace.chain_id));

  return (
    <SidebarContainer>
      {isLoading && <Loading />}
      <SidebarSection>
        {/* logo */}
        <LeftSide>
          <Logo>
            <img src={logo} alt="" />
            <h5>Quick Accounting</h5>
          </Logo>
          {/* workspace section */}
          {/* <Workspace> */}
          <WorkspaceList>
            {/* user workspaces */}
            {userWorkspaces.data.rows.map((workspace) => (
              <Workspace
                key={workspace.ID}
                onClick={() => handleFetchWorkspaceDetails(workspace.ID)}
                // isActive={id === workspace.ID}
                style={
                  Number(id) === workspace.ID
                    ? { border: "2px solid var(--clr-primary-900)" }
                    : undefined
                }
              >
                {workspace.avatar === "" ? (
                  <p>{workspace.name.slice(0, 1)}</p>
                ) : (
                  <img src={workspace.avatar} alt={workspace.name} />
                )}
                <ChainLogo src={getChainLogo(workspace.chain_id)} alt="" />
              </Workspace>
            ))}
            <Link to="/create-workspace">
              <AddIcon>
                <img src={plus} alt="" />
              </AddIcon>
            </Link>
          </WorkspaceList>
          {/* </Workspace> */}
        </LeftSide>
        <UserBox>
          <Link to="/user/payment-request">
            <img
              src={avatar}
              alt=""
              style={
                pathname.startsWith("/user")
                  ? { border: "2px solid var(--clr-primary-900)" }
                  : undefined
              }
            />
          </Link>
          {/* <Version /> */}
        </UserBox>
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div``;
const SidebarSection = styled.div`
  padding: 10px 20px;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--clr-gray-200);
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
`;
const LeftSide = styled.div`
  display: flex;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 73px;
  h5 {
    font-size: 16px;
    font-weight: 700;
  }
  img {
    width: 40px;
    height: 40px;
  }
`;
const WorkspaceList = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  /* height: 100%; */
  /* overflow-y: auto; */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const Workspace = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--clr-gray-200);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  p {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;
const ChainLogo = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(40%, 10%);
  border-radius: 50%;
`;
const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--clr-gray-200);
  border-radius: 50%;
  color: #111;
  cursor: pointer;
  img {
    width: 16px;
  }
`;

const UserBox = styled.div`
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  text-align: center;
  a {
    height: 100px;
  }
  .version {
    color: #ccc;
    font-size: 13px;
    margin-top: 10px;
  }
`;
